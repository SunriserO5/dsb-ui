const { createServer } = require("node:http");
const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const { mkdir, readFile, writeFile } = require("node:fs/promises");
const { dirname, extname, join, resolve } = require("node:path");
const { WebSocketServer } = require("ws");

const isPackaged = Boolean(process.pkg);
const appRoot = isPackaged ? dirname(process.execPath) : resolve(__dirname, "..");
const distRoot = resolve(__dirname, "../dist");
const statePath = join(appRoot, "data/live-state.json");
const port = Number(process.env.STATE_SERVER_PORT || process.env.PORT || 8787);
const themeIds = new Set([
  "caerulaarbor",
  "crimsonsolitaire",
  "furnacesidefables",
  "gardenofgrotesqueries",
  "samiexpedition",
]);

const defaultState = {
  theme: "caerulaarbor",
  scene: "live",
  updatedAt: new Date().toISOString(),
  match: {
    eventTitle: "水月与深蓝之树",
    roundTitle: "赛事表演赛",
    caster: "本场解说",
    supportTimer: {
      baseMs: 0,
      startedAt: null,
      running: false,
    },
    standbyTimer: {
      baseMs: 0,
      startedAt: null,
      running: false,
    },
    standbyPrompt: "请选手准备，导播确认画面后开始。",
  },
  player: {
    name: "当前选手",
    team: "所属队伍",
    avatarLabel: "MIZUKI",
    avatarUrl: "",
  },
  team: {
    name: "所属队伍",
    avatarUrl: "",
    openingOperatorAvatarUrl: "",
    members: [
      { label: "开局干员", value: "待确认" },
      { label: "开局分队", value: "待确认" },
    ],
  },
};

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

let state = defaultState;
let saveTimer;
let wss;

async function loadState() {
  try {
    const file = await readFile(statePath, "utf8");
    state = normalizePatch(JSON.parse(file));
  } catch (error) {
    console.warn("[state] using default state:", error.message);
  }
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await mkdir(dirname(statePath), { recursive: true });
      await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`);
    } catch (error) {
      console.error("[state] failed to save:", error);
    }
  }, 200);
}

function broadcast(payload) {
  const message = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}

function normalizePatch(nextState = {}) {
  const nextMatch = { ...defaultState.match, ...nextState.match };
  const theme = themeIds.has(nextState.theme)
    ? nextState.theme
    : defaultState.theme;

  for (const timerKey of ["supportTimer", "standbyTimer"]) {
    if (!nextMatch[timerKey]) {
      nextMatch[timerKey] = defaultState.match[timerKey];
    } else if (typeof nextMatch[timerKey].baseMs !== "number") {
      nextMatch[timerKey] = {
        baseMs: Math.max(0, Number(nextMatch[timerKey].baseSeconds || 0) * 1000),
        startedAt: nextMatch[timerKey].startedAt ?? null,
        running: Boolean(nextMatch[timerKey].running),
      };
    }
  }

  return {
    ...defaultState,
    ...nextState,
    theme,
    match: nextMatch,
    player: { ...defaultState.player, ...nextState.player },
    team: {
      ...defaultState.team,
      ...nextState.team,
      members: Array.isArray(nextState.team?.members)
        ? nextState.team.members.slice(0, 8)
        : defaultState.team.members,
    },
    updatedAt: new Date().toISOString(),
  };
}

function sendJson(response, status, data) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

function getStaticPath(requestUrl) {
  const url = new URL(requestUrl || "/", "http://localhost");
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") {
    pathname = "/control";
  }

  const requestedPath = resolve(distRoot, `.${pathname}`);
  if (!requestedPath.startsWith(distRoot)) {
    return null;
  }

  if (existsSync(requestedPath)) {
    return requestedPath;
  }

  if (extname(pathname)) {
    return requestedPath;
  }

  return resolve(distRoot, "index.html");
}

function openControlPage(url) {
  if (process.env.NO_OPEN_BROWSER) {
    return;
  }

  const command =
    process.platform === "win32"
      ? "cmd"
      : process.platform === "darwin"
        ? "open"
        : "xdg-open";
  const args =
    process.platform === "win32"
      ? ["/c", "start", "", url]
      : [url];

  try {
    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.unref();
  } catch (error) {
    console.warn("[server] failed to open browser:", error.message);
  }
}

async function serveStatic(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405);
    response.end();
    return;
  }

  const filePath = getStaticPath(request.url);
  if (!filePath) {
    response.writeHead(403);
    response.end();
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "cache-control": filePath.endsWith("index.html")
        ? "no-cache"
        : "public, max-age=31536000, immutable",
      "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    response.writeHead(404);
    response.end("Not found");
  }
}

async function main() {
  await loadState();

  const server = createServer((request, response) => {
    if (request.url === "/health") {
      sendJson(response, 200, { ok: true, clients: wss.clients.size });
      return;
    }

    serveStatic(request, response);
  });

  wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "state", state }));

    socket.on("message", (raw) => {
      try {
        const message = JSON.parse(raw.toString());
        if (message.type !== "update" || !message.state) {
          return;
        }

        state = normalizePatch(message.state);
        queueSave();
        broadcast({ type: "state", state });
      } catch (error) {
        socket.send(JSON.stringify({ type: "error", message: error.message }));
      }
    });
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`[server] ${port} 端口已被占用，请先关闭旧的大啥杯直播UI窗口。`);
    } else if (error.code === "EACCES" || error.code === "EPERM") {
      console.error(`[server] 没有权限监听 ${port} 端口，请换一个端口或检查系统权限。`);
    } else {
      console.error("[server] failed:", error);
    }
    process.exitCode = 1;
  });

  server.listen(port, "0.0.0.0", () => {
    const controlUrl = `http://127.0.0.1:${port}/control`;
    console.log("大啥杯直播UI 已启动");
    console.log(`控制台: ${controlUrl}`);
    console.log(`OBS直播画面: http://127.0.0.1:${port}/live`);
    console.log(`待机画面: http://127.0.0.1:${port}/standby`);
    console.log(`状态文件: ${statePath}`);
    console.log("关闭这个窗口即可停止服务。");
    openControlPage(controlUrl);
  });
}

main().catch((error) => {
  console.error("[server] failed to start:", error);
  process.exitCode = 1;
});

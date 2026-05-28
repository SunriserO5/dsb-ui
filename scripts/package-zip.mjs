import { execFile } from "node:child_process";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
  await readText(join(root, "package.json")),
);
const version = packageJson.version;
const releaseRoot = join(root, "release");
const packageName = `大啥杯直播UI-v${version}-win-x64`;
const packageDir = join(releaseRoot, packageName);
const exeSource = join(releaseRoot, "大啥杯直播UI.exe");
const zipPath = join(releaseRoot, `${packageName}.zip`);

await rm(packageDir, { force: true, recursive: true });
await rm(zipPath, { force: true });
await mkdir(join(packageDir, "data"), { recursive: true });

await copyFile(exeSource, join(packageDir, "大啥杯直播UI.exe"));
await copyFile(
  join(root, "data/live-state.json"),
  join(packageDir, "data/live-state.json"),
);
await writeFile(join(packageDir, "使用说明.txt"), getReadme(), "utf8");

if (process.platform === "win32") {
  await execFileAsync("powershell", [
    "-NoProfile",
    "-Command",
    "Compress-Archive",
    "-Path",
    join(packageDir, "*"),
    "-DestinationPath",
    zipPath,
    "-Force",
  ]);
} else {
  await execFileAsync("zip", ["-r", `${packageName}.zip`, packageName], {
    cwd: releaseRoot,
  });
}

console.log(`发布包已生成: ${zipPath}`);

async function readText(path) {
  const { readFile } = await import("node:fs/promises");
  return readFile(path, "utf8");
}

function getReadme() {
  return `大啥杯直播UI v${version}

启动方式
1. 双击“大啥杯直播UI.exe”。
2. 程序会自动打开控制台。
3. OBS Browser Source 采集直播画面地址：
   http://127.0.0.1:8787/live

常用地址
- 控制台：http://127.0.0.1:8787/control
- 直播画面：http://127.0.0.1:8787/live
- 待机画面：http://127.0.0.1:8787/standby
- 健康检查：http://127.0.0.1:8787/health

局域网控制
如果要用另一台设备控制，请在直播电脑上查看局域网 IP，然后访问：
http://直播电脑IP:8787/control

状态保存
- 所有主题、选手、队伍、头像和计时器状态保存在 data/live-state.json。
- 备份或迁移时，把 data 文件夹一起复制即可。

关闭方式
关闭程序窗口即可停止服务。
`;
}

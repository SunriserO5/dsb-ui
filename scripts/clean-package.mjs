import { rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const releaseRoot = join(root, "release");

await Promise.all([
  rm(join(releaseRoot, "大啥杯直播UI.exe"), { force: true }),
  rm(join(releaseRoot, "大啥杯直播UI 2.exe"), { force: true }),
]);

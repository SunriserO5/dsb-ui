# 大啥杯直播UI

给 OBS、直播伴侣等采集软件使用的本地直播包装 UI。项目包含直播采集页、待机页和导播控制台，支持五套主题切换、选手/队伍信息编辑、头像上传、开局干员选择、支援倒计时和待机倒计时。

## 页面地址

开发环境默认地址：

- 直播采集页：`http://localhost:5173/live`
- 待机预览页：`http://localhost:5173/standby`
- 导播控制台：`http://localhost:5173/control`

便携版 exe 默认地址：

- 直播采集页：`http://127.0.0.1:8787/live`
- 待机预览页：`http://127.0.0.1:8787/standby`
- 导播控制台：`http://127.0.0.1:8787/control`
- 健康检查：`http://127.0.0.1:8787/health`

OBS 只采集 `/live`。控制台不要放进 OBS 采集源。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

这会同时启动：

- Vite 前端：`http://localhost:5173`
- WebSocket 状态服务：`ws://localhost:8787`

构建检查：

```bash
npm run build
```

## 生产服务

如果不需要打包 exe，只想在本机用构建后的生产服务：

```bash
npm run build
npm start
```

启动后访问：

- `http://127.0.0.1:8787/control`
- `http://127.0.0.1:8787/live`

状态会保存到 `data/live-state.json`。

## Windows 便携包

生成 Windows x64 便携包：

```bash
npm run package:zip
```

产物位置：

```text
release/大啥杯直播UI-v0.1.0-win-x64.zip
```

发布包内容：

- `大啥杯直播UI.exe`
- `data/live-state.json`
- `使用说明.txt`

Windows 用户解压后双击 `大啥杯直播UI.exe` 即可启动。程序会自动打开控制台，OBS 采集 `http://127.0.0.1:8787/live`。

## GitHub Release 手动发布

1. 运行 `npm run package:zip`。
2. 打开 GitHub 仓库的 Releases 页面。
3. 新建 tag，例如 `v0.1.0`。
4. 上传 `release/大啥杯直播UI-v0.1.0-win-x64.zip`。
5. 发布 Release。

`release/` 已加入 `.gitignore`，发布产物不需要提交进仓库。

## 局域网控制

直播电脑启动服务后，其他设备可以访问：

```text
http://直播电脑IP:8787/control
```

如果打不开，检查 Windows 防火墙是否允许 `大啥杯直播UI.exe` 或 Node 访问专用网络。

## 状态与数据

- 直播状态保存在 `data/live-state.json`。
- 选手头像、战队头像会以 data URL 写入状态文件。
- 备份或迁移时，复制发布包里的 `data` 文件夹即可。
- 主题、计时器、选手、队伍和待机提示都是同一套状态，不按主题分开保存。

## 项目结构

```text
src/                  React 前端
server/state-server.js 开发环境 WebSocket 状态服务
server/package-server.cjs 生产/便携包服务入口
scripts/              打包辅助脚本
assets/               主题素材和头像素材
data/live-state.json  本地直播状态
```

## 注意事项

- `/live` 是直播采集画面，不包含控制按钮和调试面板。
- 主画面透明区域用于叠放选手屏幕共享，OBS 中把选手画面放在网页源下层。
- 推荐 OBS Browser Source 设置为 `1920x1080`。
- 若提示 `8787` 端口被占用，请关闭旧的 UI 程序窗口后再启动。

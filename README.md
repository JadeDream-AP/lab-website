# Complex Systems & Intelligence Lab Demo

这是一个适合 GitHub Pages 托管的静态课题组网站 demo，包含首页、研究方向、团队成员、代表论文、动态和联系入口。

## 本地预览

直接打开 `index.html`，或使用任意静态服务器：

```bash
python -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 发布到 GitHub Pages

1. 在 GitHub 新建仓库，例如 `lab-website`。
2. 将本目录内容推送到仓库的 `main` 分支。
3. 在仓库 `Settings -> Pages` 中将 Source 选择为 `GitHub Actions`。
4. 推送后 `.github/workflows/pages.yml` 会自动部署静态站。

## 后续替换内容

- `index.html`：替换课题组名称、研究方向、成员、论文和新闻。
- `assets/research-hero.png`：替换为真实实验室照片、成果图或更贴合方向的视觉图。
- `styles.css`：调整配色、字号和模块密度。
- `script.js`：控制滚动动效、首屏视差和 canvas 流线背景。

# Xuan Guang Homepage

这是一个适合 GitHub Pages 托管的静态个人主页，目前按导师现有网站
`https://xuanguang.mysxl.cn/` 的页面结构、内容层级和视觉风格重建。

## 本地预览

直接打开 `index.html`，或使用任意静态服务器：

```bash
python -m http.server 8080
```

然后访问 `http://127.0.0.1:8080`。

## 当前页面结构

- 顶部导航：南开大学数学科学学院标识、中文/英文入口、Curriculum Vitae 按钮
- 首屏：光炫教授照片、职称、人才计划、地址和邮箱
- 正文：个人简介、学术经历、奖励与荣誉、论文著作
- 页脚：南开大学 | 数学科学学院

中文和英文内容均写入 `index.html`，通过站内语言按钮切换，不依赖外部英文页面跳转。

## 主要文件

- `index.html`：页面内容和结构
- `styles.css`：页面配色、排版、响应式布局
- `script.js`：移动端导航展开/收起
- `assets/`：本地图片资源
- `assets/papers/`：站内托管的论文 PDF 文件

论文条目可通过 `data-paper-link` 绑定站内 PDF。点击后会在当前页面打开内嵌 PDF 查看器，
不会跳转到外部网站。

## 发布到 GitHub Pages

仓库已包含 `.github/workflows/pages.yml`。推送到 `main` 后，可在 GitHub Pages
启用 GitHub Actions 作为 Source，由工作流自动发布静态站点。

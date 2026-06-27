# Days Matter 倒数日应用

一个简洁的倒数日/正数日网页应用，支持通过URL参数自定义内容。

## 功能特点

- 📅 自动识别过去/未来日期
- 🖼️ 自定义背景图片
- 🎨 可调节遮罩透明度
- 🔗 支持添加链接（带图标）
- 🖱️ 鼠标移动时卡片3D倾斜效果
- 📱 陀螺仪倾斜支持（HTTPS协议下，爱疯手机需要用户授权）

## URL参数说明

| 参数 | 说明 | 必填 |
|------|------|------|
| `title` | 标题文字 | 否 |
| `date` | 日期（格式：YYYY-MM-DD 或 YYYY/MM/DD） | 是 |
| `bg` | 背景图片URL | 否 |
| `opacity` | 遮罩透明度（0.1-1.0） | 否 |
| `icon` | 链接图标序号（参考icons.js） | 否 |
| `linkname` | 链接名称 | 否 |
| `linkurl` | 链接地址 | 否 |

## 使用例

```
https://daysmatterapi.vercel.app/?title=依一拉黑我&date=2025-11-25&bg=mclvlc.jpeg&opacity=0.6&icon=261&linkname=回忆&linkurl=gallery\gallery.html
```

## 日期判断逻辑

- **过去日期**（date < 今天）：显示"已经 X 天"
- **未来日期**（date >= 今天）：显示"还有 X 天"

## 文件结构

在daysmatterapi.vercel.app/后添加文件名可直接打开。

[图标预览](https://daysmatterapi.vercel.app/预览.html)

```
├── index.html          # 主页面
├── script.js           # 核心逻辑
├── styles.css          # 样式文件
├── icons.js            # 图标数据
├── 预览.html           # 图标预览页面
├── KNMaiyuan.ttf       # 字体文件
├── example.JPG         # 默认背景图
├── SVG/                # 图标目录
└── README.md           # 说明文档
```

## 图标预览

打开 `预览.html` 查看所有可用图标及其序号。

## 开发运行

直接双击打开

或者

```bash
python -m http.server 8080
```

访问 `http://localhost:8080` 可查看预览。

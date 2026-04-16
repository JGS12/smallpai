# 月子小家 (Paipai-mini) 👶✨

这是一个专为家庭内部设计的**月子生活信息小程序**。旨在通过简洁、治愈的界面，帮助家人轻松查看月子期间的饮食建议、妈妈照护重点、宝宝护理要点及家庭分工安排。

## 🌟 项目亮点

- **温馨治愈风格**：采用奶白背景与肤粉色调，打造母婴感极强的视觉体验。
- **全栈数据闭环**：前端 UniApp + 后端 Koa2 + 云服务器 MySQL 存储。
- **实用功能模块**：
  - 🍱 **月子餐单**：按周规划营养饮食。
  - 👩‍🍼 **妈妈照护**：产后恢复与心理疏导重点。
  - 👶 **宝宝护理**：新生儿喂养与日常照料指南。
  - 📅 **家庭计划**：明确家庭分工，有序应对月子生活。
  - 📚 **月子知识**：精选百科知识库。

## 🛠️ 技术栈

### 前端
- **框架**：UniApp (Vue3 Composition API)
- **样式**：CSS Variables + Flexbox (遵从项目定制 UI 规范)
- **状态管理**：Pinia
- **网络请求**：uni.request 封装

### 后端
- **内核**：Node.js + Koa2
- **数据库**：MySQL 8.0
- **进程管理**：PM2 (实现持久运行)
- **反向代理**：Nginx

## 📂 目录结构

```text
paipai-mini/
├── frontend/             # UniApp 小程序源码
│   ├── pages/            # 业务页面
│   ├── components/       # 公共组件库
│   └── utils/            # 工具类 (request, date etc.)
├── server/               # Koa 后端服务源码
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   ├── services/     # 数据库业务逻辑层
│   │   └── utils/        # 数据库与响应封装
│   └── db/               # 数据库初始化脚本 (init.sql)
└── README.md             # 项目说明文档
```

## 🚀 快速开始

### 1. 后端部署
1. 进入 `server` 目录，安装依赖：`npm install`
2. 参照 `.env` 模板配置您的数据库连接信息。
3. 执行 `db/init.sql` 初始化数据库结构及初始数据。
4. 使用 PM2 启动：`pm2 start src/app.js --name paipai-api`

### 2. 前端运行
1. 进入 `frontend` 目录，安装依赖：`npm install`
2. 修改 `utils/request.js` 中的 `BASE_URL` 为您的服务器 API 地址。
3. 使用 **HBuilderX** 或终端运行至微信开发者工具。

## 📝 维护指南

- **数据更新**：如需增加菜品或知识点，直接在 MySQL 数据库 `meals` 或 `knowledge` 表中插入记录即可，前端自动同步。
- **证书管理**：建议使用 HTTPS 部署，并确保域名已完成 ICP 备案。

---
*Powered by Antigravity with Love 💖*

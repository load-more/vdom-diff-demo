## 环境搭建

### snabbdom简介

- snabbdom 是一个瑞典语单词，意为 “速度”；
- snabbdom 是著名的虚拟 DOM 库，是 diff 算法的鼻祖，Vue 源码借鉴了 snabbdom；
- 官方 git：https://github.com/snabbdom/snabbdom
- github 上的 snabbdom 源码是用 TypeScript 写的，git 上并不提供编译好的 JavaScript 版本；
- 如果要直接使用 build 出来的 JavaScript 版的 snabbdom 库，可以从 npm 上下载：`npm install -S snabbdom`；
- 由于 snabbdom 是 DOM 库，不能在 nodejs 环境下运行，所以需要搭建 webpack 和 webpack-dev-server 开发环境，而且不需要安装任何 loader；
- 需要注意的是，**必须安装最新版 webpack@5，不能安装 webpack@4**，这是因为 webpack4 没有读取身份证中 exports 的能力，建议安装：`npm install -D webpack@5 webpack-cli@3 webpack-dev-server@3`；

### 配置webpack






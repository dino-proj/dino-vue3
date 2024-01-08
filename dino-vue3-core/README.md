
# 🦖 介绍
dino-vue-core是dino-vue3前端框架的核心模块，主要承载dino开发框架的通用类型定义，Api定义，权限验证，配置等功能，与dino-spring内置类型和接口保持一致。

## 💡 版本依赖
- *Vue3*: >=3.2
- *Node.js*: >=18.0
- *TypeScript*: >=4.4
- *Vite*: >=5.0
- *lodash-es*: >=4.0,

## 🚀 快速开始

### 命令如下
```shell
npm install @dino-dev/vue3-core
# OR
yarn add @dino-dev/vue3-core

```

### NPM
NPM包地址：https://www.npmjs.com/package/@dino-dev/vue3-core

### 源代码
源代码地址：https://github.com/dino-proj/dino-vue3/tree/main/dino-vue3-core

### 引入
```ts
import { setupDinoCore } from '@dino-dev/vue3-core'


```

## ⌨️ 使用

### 使用axios作为请求库
```ts
// 需要在你的项目中安装axios
// `yarn add axios` or `npm install axios`
// 在main.js中配置
import { axiosRequestProvider } from '@dino-dev/vue3-core/axios'
setupDinoCore({
  api: {
    baseUrl: 'https://dinodev.cn/api',
    requestTimeout: 60000,
    successCode: 0,
    needLoginCode: 630
  },
  requestProvider: axiosRequestProvider // `◀️ 使用axios作为请求库`
})
```

### 使用uni.Request作为请求库
```ts
// 在main.js中配置
// 需要安装依赖 `uniapp-axios-adapter` >=0.3.2
// `yarn add uniapp-axios-adapter` or `npm install uniapp-axios-adapter`
import { uniRequestProvider } from '@dino-dev/vue3-core/uni'
setupDinoCore({
  api: {
    baseUrl: 'https://dinodev.cn/api',
    requestTimeout: 60000,
    successCode: 0,
    needLoginCode: 630
  },
  requestProvider: uniRequestProvider // `◀️ 使用uni作为请求库`
})
```

### 使用wx.Request作为请求库
```ts
// 在main.js中配置
// 需要安装依赖 `axios-miniprogram-adapter` >=0.3.5
// `yarn add axios-miniprogram-adapter` or `npm install axios-miniprogram-adapter`
import { wxRequestProvider } from '@dino-dev/vue3-core/wx'
setupDinoCore({
  api: {
    baseUrl: 'https://dinodev.cn/api',
    requestTimeout: 60000,
    successCode: 0,
    needLoginCode: 630
  },
  requestProvider: wxRequestProvider // `◀️ 使用wx作为请求库`
})
```


## 📃 详细文档
[详细开发文档](https://dinodev.cn/dino-vue3/core/)https://dinodev.cn/dino-vue3/core/

## ⚖ License

dino-frame-vue3 is open source software licensed as [Apache-2.0](./LICENSE).

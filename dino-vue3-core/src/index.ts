// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { ApiConfig, HttpRequest, setupApi } from './api'
import { MessageFun, MessageHandler, setupMessage } from './message'

export * from './common'
export * from './auth'
export * from './utils'
export * from './message'
export * from './api'

export interface DinoCoreConfig {
  /**
   * 用于处理消息提示
   *
   * @default nopMessageFun 忽略提示
   */
  message?: MessageHandler

  /**
   * 用于处理api请求
   *
   * @default 参见 api 模块 {@link setupApi}
   */
  api?: ApiConfig

  /**
   * 用于执行网络请求的初始化函数
   *
   * @see {@link useAxios}
   */
  requestProvider: (api: ApiConfig) => HttpRequest
}

const warnTips = 'default `consoleMessageHandler` used \nPlease `setupDinoCore({msgHandlers:H})` or `setupMessage(msgHandlers)` first before call `useMessage()`'
const consoleMessageHandler: MessageHandler = {
  success: (msg) => {
    console.warn(warnTips)
    console.log('success: ' + msg)
  },
  info: (msg) => {
    console.warn(warnTips)
    console.log('info: ' + msg)
  },
  warning: (msg) => {
    console.warn(warnTips)
    console.warn('warn: ' + msg)
  },
  error: (msg) => {
    console.warn(warnTips)
    console.error('error: ' + msg)
  }
}

export const setupDinoCore = (config: DinoCoreConfig): void => {
  // setup the message handler
  setupMessage(config.message ?? consoleMessageHandler)

  // setup the api request
  setupApi(config.requestProvider, config.api)
}

// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { ApiConfig, ApiReqeust, setupApi } from './api'
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
  apiRequest: (api: ApiConfig) => ApiReqeust
}

const nopMessageFun: MessageFun = () => {
  console.warn('Please use `setupDinoCore({msgHandlers:H})` or `provide(MessageSymbol)` first before call `useMessage()`')
}
const nopMessageHandler: MessageHandler = {
  success: nopMessageFun,
  info: nopMessageFun,
  warning: nopMessageFun,
  error: nopMessageFun
}

export const setupDinoCore = (config: DinoCoreConfig): void => {
  // setup the message handler
  setupMessage(config.message ?? nopMessageHandler)

  // setup the api request
  setupApi(config.apiRequest, config.api)
}

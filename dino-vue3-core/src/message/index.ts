// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { isNil } from 'lodash-es'

export declare type MessageFun = (msg: string, options?: any) => void

/**
 * 消息提示接口
 */
export interface MessageHandler {
  success: MessageFun
  info: MessageFun
  warning: MessageFun
  error: MessageFun
}

/**
 * 消息类型
 */
export type MessageType = `${string & keyof MessageHandler}`

/**
 * 消息处理函数, 默认使用console
 */
export const consoleMessageHandler: MessageHandler = {
  success: (msg) => {
    console.log('success: ' + msg)
  },
  info: (msg) => {
    console.log('info: ' + msg)
  },
  warning: (msg) => {
    console.warn('warn: ' + msg)
  },
  error: (msg) => {
    console.error('error: ' + msg)
  }
}

export interface MessageOptions {
  /**
   * 消息处理函数
   */
  messageHandler: MessageHandler
}

let msg: MessageHandler = consoleMessageHandler

/**
 * 使用消息函数，用来显示提示消息
 * @param msgType 消息类型
 * @returns
 */
export function useMessage(): MessageHandler
export function useMessage(msgType: MessageType): MessageFun
export function useMessage(msgType?: MessageType): MessageFun | MessageHandler {
  const _msg = msg
  if (isNil(_msg)) {
    throw new Error('Please use `setupMessage()` or `provide(MessageSymbol, v)` first before call `useMessage()`')
  }
  if (!isNil(msgType)) {
    return _msg[msgType]
  }
  return _msg
}

/**
 * 设置消息处理对象
 * @param _msg
 */
export const setupMessage = (options: MessageOptions): void => {
  msg = options.messageHandler
}

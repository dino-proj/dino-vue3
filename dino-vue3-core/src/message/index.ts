// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { isNil } from 'lodash-es'

import { InjectionKey, inject, provide } from '@vue/runtime-core'

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
 * 消息提示接口Symbol, 用于InjectionKey
 */
export const MessageSymbol: InjectionKey<MessageHandler> = Symbol()

/**
 * 消息类型
 */
export type MessageType = `${string & keyof MessageHandler}`

let msg: MessageHandler

/**
 * 使用消息函数，用来显示提示消息
 * @param msgType 消息类型
 * @returns
 */
export function useMessage(): MessageHandler
export function useMessage(msgType: MessageType): MessageFun
export function useMessage(msgType?: MessageType): MessageFun | MessageHandler {
  const _msg = inject(MessageSymbol, msg)
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
export const setupMessage = (_msg: MessageHandler): void => {
  msg = _msg
}

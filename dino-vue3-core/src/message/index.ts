// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { isNil } from 'lodash-es'

export declare type MessageFun = (msg: string, options?: any) => void

/**
 * 消息提示接口
 */
export interface Message {
  success: MessageFun
  info: MessageFun
  warning: MessageFun
  error: MessageFun
}

/**
 * 消息类型
 */
export type MessageType = `${string & keyof Message}`

let msg: Message

/**
 * 使用消息函数，用来显示提示消息
 * @param msgType 消息类型
 * @returns
 */
export function useMessage(): Message
export function useMessage(msgType: MessageType): MessageFun
export function useMessage(msgType?: MessageType): MessageFun | Message {
  if (isNil(msg)) {
    throw new Error('Please use `setupMessage()` or `provide("")` first before call `useMessage()`')
  }
  if (!isNil(msgType)) {
    return msg[msgType]
  }
  return msg
}

/**
 * 设置消息处理对象
 * @param _msg
 */
export const setupMessage = (_msg: Message): void => {
  msg = _msg
}

// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { extend } from 'lodash-es'
import { HttpHeaderType, ApiParamType, HttpRequest, ProxyConfig } from './types'
import { Tenant } from '../common'
import { AuthToken } from '../auth'

/**
 * Api配置类型
 */
export interface ApiConfig {
  /**
   * api请求基础路径，如：https://dinosdev.cn/api
   */
  baseUrl: string

  /**
   * 接口请求超时时间(毫秒)，默认：-1，表示不设置超时
   */
  requestTimeout?: number

  /**
   * 接口成功返回状态码，默认：0
   */
  successCode?: number | number[]

  /**
   * 需要重新登录的状态码，默认：630
   */
  needLoginCode?: number | number[]

  /**
   * 获取租户信息函数
   * @returns null表示不需要租户信息
   */
  tenant?: () => Tenant | undefined

  /**
   * 获取登录凭证函数
   * @returns null表示不需要登录凭证
   */
  authToken?: () => AuthToken | undefined

  /**
   * 自动登录函数
   * @returns 自动登录成功返回true，否则返回false
   */
  autoLogin?: () => Promise<boolean>

  /**
   * 接口请求默认的headers
   * @default {}
   */
  defaultHeaders?: HttpHeaderType

  /**
   * 接口请求默认的url参数
   * @default {}
   */
  defaultParams?: ApiParamType

  /**
   * 是否开启代理
   * @default false
   */
  proxy?: ProxyConfig | false
}

export const defaultApiConfig: ApiConfig = {
  baseUrl: '',
  requestTimeout: -1,
  successCode: 0,
  needLoginCode: [630],
  tenant: () => null,
  authToken: () => null,
  autoLogin: () => Promise.reject(new Error('autoLogin not implemented')),
  defaultHeaders: {},
  defaultParams: {},
  proxy: false
}

/**
 * Request Provider函数类型
 */
export type RequestProvider = (config: ApiConfig) => HttpRequest

let apiConfig: ApiConfig = { ...defaultApiConfig }
let request: HttpRequest = null

export interface ApiOptions {
  /**
   * 请求提供函数
   */
  requesterProvider: RequestProvider

  /**
   * api配置
   */
  config: ApiConfig
}

/**
 * 配置API
 * @param config api配置
 */
export const setupApi = (options: ApiOptions) => {
  apiConfig = extend(apiConfig, options.config)

  request = options.requesterProvider(apiConfig)
}

export const useRequest = (): HttpRequest => {
  if (!request) {
    throw new Error('Please call `setupApi()` before useRequest')
  }
  return request
}

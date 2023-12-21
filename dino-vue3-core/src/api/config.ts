// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { extend } from 'lodash-es'
import { ApiHeaderType, ApiParamType, ApiReqeust, ProxyConfig } from './types'
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
   * 接口请求超时时间(毫秒)，默认：60s
   */
  requestTimeout: number

  /**
   * 接口成功返回状态码，默认：0
   */
  successCode: number | number[]

  /**
   * 需要重新登录的状态码，默认：630
   */
  needLoginCode: number | number[]

  /**
   * 获取租户信息函数
   * @returns null表示不需要租户信息
   */
  tenant?: () => Tenant

  /**
   * 获取登录凭证函数
   * @returns null表示不需要登录凭证
   */
  authToken?: () => AuthToken

  /**
   * 自动登录函数
   * @returns 自动登录成功返回true，否则返回false
   */
  autoLogin?: () => Promise<boolean>

  /**
   * 接口请求默认的headers
   */
  defaultHeaders?: ApiHeaderType

  /**
   * 接口请求默认的url参数
   */
  defaultParams?: ApiParamType

  /**
   * 是否开启代理
   */
  proxy?: ProxyConfig | false
}

export const defaultApiConfig: ApiConfig = {
  baseUrl: '',
  requestTimeout: 60000,
  successCode: 0,
  needLoginCode: [630],
  tenant: () => null,
  authToken: () => null,
  autoLogin: () => Promise.reject(new Error('autoLogin not implemented'))
}

let apiConfig: ApiConfig = { ...defaultApiConfig }
let request: ApiReqeust = null
/**
 * 配置API
 * @param config api配置
 */
export const setupApi = (initer: (config: ApiConfig) => ApiReqeust, config?: Partial<ApiConfig>) => {
  if (config) {
    apiConfig = extend(apiConfig, config)
  }

  request = initer(apiConfig)
}

export const useRequest = (): ApiReqeust => {
  if (!request) {
    throw new Error('Please call `setupApi()` before useRequest')
  }
  return request
}

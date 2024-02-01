// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ApiConfig, HttpRequest, RequestProvider } from '../api'

export const axiosWithAdapter = (adapter?: AxiosRequestConfig['adapter']): RequestProvider => {
  return (config: ApiConfig): HttpRequest => {
    // 创建axios实例
    const service: AxiosInstance = axios.create({
      baseURL: config.baseUrl, // api 的 base_url
      timeout: config.requestTimeout, // 请求超时时间
      headers: config.defaultHeaders,
      params: config.defaultParams,
      proxy: config.proxy,
      adapter
    })

    return service
  }
}

/**
 * 创建一个新的Axios请求对象
 * @param config 配置信息
 * @returns
 */
export const axiosRequestProvider: RequestProvider = axiosWithAdapter()

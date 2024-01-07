// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { isEmpty } from 'lodash-es'
import { stringify } from 'qs'
import { ApiConfig, ApiResponse, HttpRequest, RequestProvider } from '../api'
import { Tenant } from '../common'
import { useMessage } from '../message'
import { asArray } from '../utils'

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

    const successCode: number[] = asArray(config.successCode)
    const needLoginCode: number[] = asArray(config.needLoginCode)

    // request拦截器
    service.interceptors.request.use(
      (conf) => {
        if (conf.method === 'post' && conf.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
          conf.data = stringify(conf.data)
        }

        const tenant: Tenant = config.tenant()

        if (!isEmpty(tenant)) {
          conf.url = conf.url.replace('{tenant}', tenant.id)
        }

        const authToken = config.authToken()
        if (authToken) {
          conf.headers[authToken.authHeaderName] = authToken.authPayload
        }
        return conf
      },
      (error: AxiosError) => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
      }
    )

    // response 拦截器
    service.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data as ApiResponse<any>

        if (successCode.indexOf(data.code) >= 0) {
          return response.data
        } else if (needLoginCode.indexOf(data.code) >= 0) {
          return config
            .autoLogin()
            .then(() => {
              return service(response.config)
            })
            .catch((reason) => {
              useMessage().error(reason.message)
            })
        } else {
          useMessage().error(data.msg)
          return Promise.reject(data)
        }
      },
      (error: AxiosError) => {
        console.log(error.code, 'err:' + error) // for debug

        useMessage().error('网络错误，请检查网络连接是否正常！')
        return Promise.reject(error)
      }
    )

    return service
  }
}

/**
 * 创建一个新的Axios请求对象
 * @param config 配置信息
 * @returns
 */
export const axiosRequestProvider: RequestProvider = axiosWithAdapter()

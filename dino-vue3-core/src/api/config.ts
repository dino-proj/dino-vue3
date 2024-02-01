// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { extend, isEmpty, isString } from 'lodash-es'
import { HttpHeaderType, ApiParamType, HttpRequest, ProxyConfig, RequestConfig, HttpResponse, ApiResponse } from './types'
import { InterceptorManager, Tenant, defineInterceptorManager } from '../common'
import { AuthToken } from '../auth'
import { stringify } from 'qs'
import { asArray } from '../utils'

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
  tenant?: () => Promise<Tenant> | Tenant

  /**
   * 获取登录凭证函数
   * @returns null表示不需要登录凭证
   */
  authToken?: () => Promise<AuthToken> | AuthToken

  /**
   * 自动登录函数
   * @returns 自动登录成功返回true，否则返回false
   */
  autoLogin?: () => Promise<boolean>

  /**
   * 登录过期回调函数，用于自动登录失败后的处理
   */
  onLoginExpired?: () => void

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

/**
 * 默认的Api配置
 */
export const defaultApiConfig: ApiConfig = {
  baseUrl: '',
  requestTimeout: -1,
  successCode: 0,
  needLoginCode: [630],
  tenant: () => null,
  authToken: () => null,
  autoLogin: () => Promise.reject(false),
  onLoginExpired: () => {
    console.warn('Please setup `onLoginExpired` function in `setupApi` first')
  },
  defaultHeaders: {},
  defaultParams: {},
  proxy: false
}

/**
 * Request Provider函数类型
 */
export type RequestProvider = (config: ApiConfig) => HttpRequest

/**
 * Api选项类型
 */
export interface ApiOptions {
  /**
   * 请求提供函数
   */
  requestProvider: RequestProvider

  /**
   * api配置
   */
  config: ApiConfig
}

/**
 * ApiService接口
 */
export interface ApiService {
  /**
   * 服务名称
   */
  readonly serviceName: string

  /**
   * Api配置
   */
  apiConfig: ApiConfig

  /**
   * 拦截器管理器
   */
  readonly interceptors: {
    readonly request: InterceptorManager<RequestConfig, { apiService: ApiService }>
    readonly response: InterceptorManager<HttpResponse, { requestConfig: RequestConfig; apiService: ApiService }>
  }

  /**
   * 请求函数
   */
  request: HttpRequest
}

/**
 * 存储服务Api的Map
 */
const serviceApis = new Map<string, ApiService>()

/**
 * 默认的服务键
 */
const DEFAULT_SERVICE_KEY = '_'

/**
 * 添加内置的请求拦截器，有：
 * - 添加默认baseUrl拦截器
 * - 添加默认params拦截器
 * - 添加默认headers拦截器
 * - 添加请求formData数据转换拦截器
 * - 添加默认请求超时拦截器
 * - 添加默认代理拦截器
 * - tenant_id参数拦截器
 * - token拦截器
 *
 * @param serviceApi
 */
function addInternalRequestInterceptor(serviceApi: ApiService) {
  // 添加默认baseUrl拦截器
  serviceApi.interceptors.request.use((request) => {
    if (!request.baseUrl) {
      request.baseUrl = serviceApi.apiConfig.baseUrl
    }
    return request
  })

  // 添加默认params拦截器
  serviceApi.interceptors.request.use((request) => {
    request.params = extend({}, serviceApi.apiConfig.defaultParams, request.params)
    return request
  })

  // 添加默认headers拦截器
  serviceApi.interceptors.request.use((request) => {
    request.headers = extend({}, serviceApi.apiConfig.defaultHeaders, request.headers)
    return request
  })

  // 添加默认请求超时拦截器
  serviceApi.interceptors.request.use((request) => {
    if (serviceApi.apiConfig.requestTimeout > 0 && !request.timeout) {
      request.timeout = serviceApi.apiConfig.requestTimeout
    }
    return request
  })

  // 添加默认代理拦截器
  serviceApi.interceptors.request.use((request) => {
    if (serviceApi.apiConfig.proxy && !request.proxy) {
      request.proxy = serviceApi.apiConfig.proxy
    }
    return request
  })

  // 添加请求formData数据转换拦截器
  serviceApi.interceptors.request.use((request) => {
    if (request.method === 'post' && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      request.data = stringify(request.data)
    }
    return request
  })

  // 添加请求tenent_id参数拦截器
  serviceApi.interceptors.request.use(async (request) => {
    const tenant: Tenant = await serviceApi.apiConfig.tenant()
    if (!isEmpty(tenant)) {
      request.url = request.url.replace('{tenant}', tenant.id)
      request.baseUrl = request.baseUrl.replace('{tenant}', tenant.id)
    }
    return request
  })

  // 添加请求token拦截器
  serviceApi.interceptors.request.use(async (request) => {
    const authToken = await serviceApi.apiConfig.authToken()
    if (authToken && request.withToken !== false) {
      request.headers[authToken.authHeaderName] = authToken.authPayload
    }
    return request
  })
}

/**
 * 添加内置的响应拦截器，有：
 * - 成功状态码拦截器
 * - 自动登录拦截器
 * - 默认错误提示拦截器
 *
 * @param serviceApi
 */
function addInternalResponseInterceptor(serviceApi: ApiService) {
  const successCode: number[] = asArray(serviceApi.apiConfig.successCode)
  const needLoginCode: number[] = asArray(serviceApi.apiConfig.needLoginCode)

  // 添加成功状态码拦截器
  serviceApi.interceptors.response.use((response) => {
    const data = response.data as ApiResponse<any>
    if (successCode.indexOf(data.code) >= 0) {
      return response
    } else {
      return Promise.reject(response)
    }
  })

  // 添加需要重新登录状态码拦截器
  serviceApi.interceptors.response.use((response, context) => {
    const data = response.data as ApiResponse<any>
    if (needLoginCode.indexOf(data.code) >= 0) {
      return serviceApi.apiConfig
        .autoLogin()
        .then((r) => {
          if (!r) {
            // 自动登录失败
            serviceApi.apiConfig.onLoginExpired()
          } else {
            // 自动登录成功，重新请求
            return serviceApi.request(context.requestConfig)
          }
        })
        .catch((reason) => {
          // 自动登录失败
          serviceApi.apiConfig.onLoginExpired()
          return Promise.reject(reason)
        })
    } else {
      return response
    }
  })

  // 添加默认错误提示拦截器
  serviceApi.interceptors.response.use((response) => {
    const data = response.data as ApiResponse<any>
    if (data.code !== 0) {
      return Promise.reject(response)
    } else {
      return response
    }
  })
}

function addInterceptorCall(apiService: ApiService): void {
  const oldRequest = apiService.request
  const newRequest: HttpRequest = async (urlOrConfig: string | RequestConfig, config?: RequestConfig) => {
    let requestConfig: RequestConfig = undefined
    if (isString(urlOrConfig)) {
      requestConfig = { ...config, url: urlOrConfig }
    } else {
      requestConfig = urlOrConfig
    }

    // 执行请求拦截器
    const r = await apiService.interceptors.request.execute(requestConfig, {
      apiService
    })

    // 执行请求
    const response = await oldRequest(r)

    // 执行响应拦截器
    const responseConfig = {
      requestConfig,
      apiService
    }
    return await apiService.interceptors.response.execute(response, responseConfig)
  }

  // 替换request
  apiService.request = newRequest
}

/**
 * 配置API
 * @param options Api选项
 * @param service 服务名称
 * @returns ApiService
 */
export const setupApi = (options: ApiOptions, service?: string): ApiService => {
  const key = service || DEFAULT_SERVICE_KEY

  const apiConfig = extend({ ...defaultApiConfig }, options.config)

  serviceApis.set(key, {
    serviceName: service,
    apiConfig,
    request: options.requestProvider(apiConfig),
    interceptors: {
      request: defineInterceptorManager<RequestConfig, { apiService: ApiService }>(),

      response: defineInterceptorManager<HttpResponse, { requestConfig: RequestConfig; apiService: ApiService }>()
    }
  })

  addInterceptorCall(serviceApis.get(key)!)

  addInternalRequestInterceptor(serviceApis.get(key)!)

  addInternalResponseInterceptor(serviceApis.get(key)!)

  return serviceApis.get(key)!
}

/**
 * 获取服务Api
 * @param service 服务名称
 * @returns ApiService
 * @throws Error 如果服务未配置，则抛出错误
 */
export const useApi = (service?: string): ApiService => {
  const key = service || DEFAULT_SERVICE_KEY
  const serviceApi = serviceApis.get(key)
  if (!serviceApi) {
    throw new Error(`service=[${service}] not found ,Please call \`setupApi')\` before useRequest'`)
  }
  return serviceApi
}

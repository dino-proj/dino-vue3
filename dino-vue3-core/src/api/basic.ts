// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { extend } from 'lodash-es'
import { toCamleObject, toSnakeObject } from '../utils'
import { useApi } from './config'
import {
  ApiRequestConfig,
  ApiGetConfig,
  ApiPageResponse,
  ApiParamType,
  ApiPostConfig,
  ApiResponse,
  ApiUploadConfig,
  Pageable,
  RequestConfig,
  Sortable,
  OnProgressHandler
} from './types'

/**
 * request函数
 * @param param 请求配置信息
 * @returns Promise对象
 */
export const request = async <RESP>(config: ApiRequestConfig): Promise<RESP> => {
  const { request } = useApi(config.service)

  const headers: Record<string, string> = {
    'Content-Type': config.contentType || 'application/json',
    ...config.headers
  }

  let requestConfig: RequestConfig<RESP> = {
    ...config,
    method: config.method || 'get',
    params: toSnakeObject(config.params),
    data: config.data,
    headers
  }

  let res = await request<RESP>(requestConfig)

  if (res.status !== 200) {
    throw new Error(res.statusText)
  }
  return toCamleObject(res.data)
}

/**
 * 上传函数
 * @param config 请求配置信息
 * @returns Promise对象
 */
export const upload = <RESP>(config: ApiUploadConfig): Promise<ApiResponse<RESP>> => {
  return request<ApiResponse<RESP>>({
    ...config,
    method: config.method || 'post',
    contentType: 'multipart/form-data'
  })
}

/**
 * Json Get函数
 * @param config 请求配置信息
 * @returns
 */
export const get = <RESP>(config: ApiGetConfig): Promise<ApiResponse<RESP>> => {
  return request<ApiResponse<RESP>>({
    ...config,
    method: 'get'
  })
}

/**
 * Post函数
 * @param config 请求配置信息
 * @returns
 */
export const post = <RESP>(config: ApiPostConfig): Promise<ApiResponse<RESP>> => {
  return request<ApiResponse<RESP>>({
    ...config,
    method: 'post',
    data: { body: toSnakeObject(config.data) }
  })
}

/**
 * 分页Get函数
 * <RESP> 返回类型
 * @param config 请求配置信息
 * @returns
 */
export const getPage = <RESP>(config: ApiGetConfig & { page: Pageable; sort?: Sortable }): Promise<ApiPageResponse<RESP>> => {
  return request<ApiPageResponse<RESP>>({
    ...config,
    method: 'get',
    params: extend(config.params, config.page, config.sort)
  })
}

/**
 * 分页Post函数
 * @param config 请求配置信息
 * @returns
 */
export const postPage = <RESP>(config: ApiPostConfig & { page: Pageable; sort?: Sortable }): Promise<ApiPageResponse<RESP>> => {
  return request<ApiPageResponse<RESP>>({
    ...config,
    method: 'post',
    params: extend(config.params, config.page, config.sort),
    data: { body: toSnakeObject(config.data) }
  })
}

/**
 * 定义一个Upload函数
 * @param <RESP> 返回类型
 * @param <PARAM> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个请求函数
 */
export const defineUploadApi = <RESP = any, PARAM = ApiParamType>(
  config: Omit<ApiUploadConfig, 'params' | 'data'>,
  defaultParam?: Partial<PARAM>
): ((data: FormData, params?: PARAM, onProgress?: OnProgressHandler) => Promise<ApiResponse<RESP>>) => {
  return (data: FormData, param?: PARAM, onProgress?: OnProgressHandler): Promise<ApiResponse<RESP>> => {
    return upload<RESP>({ ...config, params: extend({}, defaultParam, param), data, ...onProgress })
  }
}

/**
 * 定义一个Get函数
 * @param <RESP> 返回类型
 * @param <DATA> Form数据的类型
 * @param <PARAM> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个请求函数
 */
export const defineGetApi = <RESP = any, PARAM = ApiParamType>(
  config: Omit<ApiGetConfig, 'params'>,
  defaultParam?: Partial<PARAM>
): ((params?: PARAM) => Promise<ApiResponse<RESP>>) => {
  return (param?: PARAM): Promise<ApiResponse<RESP>> => {
    return get<RESP>({ ...config, params: extend({}, defaultParam, param) })
  }
}

/**
 * 定义一个分页Get函数
 * @param <RESP> 返回类型
 * @param <PARAM> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个分页请求函数
 */
export const defineGetPageApi = <RESP = any, PARAM = ApiParamType>(
  config: Omit<ApiGetConfig, 'params'>,
  defaultParam?: Partial<PARAM>
): ((params: PARAM, page: Pageable, sort?: Sortable) => Promise<ApiPageResponse<RESP>>) => {
  return (params: PARAM, page: Pageable, sort?: Sortable): Promise<ApiPageResponse<RESP>> => {
    return getPage<RESP>({ ...config, params: extend({}, defaultParam, params), page, sort })
  }
}

/**
 * 定义一个Post函数
 * @param <RESP> 返回类型
 * @param <DATA> Post数据的类型
 * @param <PARAM> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个请求函数
 */
export const definePostApi = <RESP = any, DATA = ApiParamType, PARAM = ApiParamType>(
  config: Omit<ApiPostConfig, 'params' | 'data'>,
  defaultParam?: Partial<PARAM>
): ((data: DATA, params?: PARAM) => Promise<ApiResponse<RESP>>) => {
  return (data: DATA, param?: PARAM): Promise<ApiResponse<RESP>> => {
    return post<RESP>({ ...config, params: extend({}, defaultParam, param), data })
  }
}

/**
 * 定义一个分页Post函数
 * @param <RESP> 返回类型
 * @param <DATA> Post数据的类型
 * @param <PARAM> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个分页请求函数
 */
export const definePostPageApi = <RESP, DATA = ApiParamType, PARAM = ApiParamType>(
  config: Omit<ApiPostConfig, 'params' | 'data'>,
  defaultParam?: Partial<PARAM>
): ((data: DATA, page: Pageable, params?: PARAM, sort?: Sortable) => Promise<ApiPageResponse<RESP>>) => {
  return (data: DATA, page: Pageable, param?: PARAM, sort?: Sortable): Promise<ApiPageResponse<RESP>> => {
    return postPage<RESP>({ ...config, params: extend({}, defaultParam, param), data, page, sort })
  }
}

// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { extend } from 'lodash-es'
import { toCamleObject, toSnakeObject } from '../utils'
import { useRequest } from './config'
import { ApiFetchConfig, ApiGetConfig, ApiPageResponse, ApiParamType, ApiPostConfig, ApiResponse, ApiUploadConfig, Pageable, Sortable } from './types'

/**
 * fetch函数
 * @param param 请求配置信息
 * @returns Promise对象
 */
export const fetch = async <RESP>({ url, method, headers, params, data, contentType, responseType, timeout, onProgress, baseURL }: ApiFetchConfig): Promise<RESP> => {
  const res = await useRequest()({
    baseURL,
    url,
    method: method || 'get',
    params: toSnakeObject(params),
    data: data,
    responseType: responseType,
    headers: {
      ...headers,
      'Content-Type': contentType || 'application/json'
    },
    timeout,
    onUploadProgress: onProgress,
    onDownloadProgress: onProgress
  })
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
  return fetch<ApiResponse<RESP>>({
    url: config.url,
    baseURL: config.baseURL,
    method: config.method || 'post',
    headers: config.headers,
    params: config.params,
    data: config.data,
    contentType: 'multipart/form-data',
    responseType: config.responseType,
    timeout: config.timeout | 3600000,
    onProgress: config.onProgress
  })
}

/**
 * Json Get函数
 * @param config 请求配置信息
 * @returns
 */
export const get = <RESP>(config: ApiGetConfig): Promise<ApiResponse<RESP>> => {
  return fetch<ApiResponse<RESP>>({
    url: config.url,
    baseURL: config.baseURL,
    method: 'get',
    headers: config.headers,
    params: config.params,
    responseType: config.responseType,
    timeout: config.timeout
  })
}

/**
 * Post函数
 * @param config 请求配置信息
 * @returns
 */
export const post = <RESP>(config: ApiPostConfig): Promise<ApiResponse<RESP>> => {
  return fetch<ApiResponse<RESP>>({
    url: config.url,
    baseURL: config.baseURL,
    method: 'post',
    headers: config.headers,
    params: config.params,
    data: { body: toSnakeObject(config.data) },
    contentType: config.contentType,
    responseType: config.responseType,
    timeout: config.timeout
  })
}

/**
 * 分页Get函数
 * <RESP> 返回类型
 * @param config 请求配置信息
 * @returns
 */
export const getPage = <RESP>(config: ApiGetConfig & { page: Pageable; sort?: Sortable }): Promise<ApiPageResponse<RESP>> => {
  return fetch<ApiPageResponse<RESP>>({
    url: config.url,
    baseURL: config.baseURL,
    method: 'get',
    headers: config.headers,
    params: extend(config.params, config.page, config.sort),
    responseType: config.responseType,
    timeout: config.timeout
  })
}

/**
 * 分页Post函数
 * @param config 请求配置信息
 * @returns
 */
export const postPage = <RESP>(config: ApiPostConfig & { page: Pageable; sort?: Sortable }): Promise<ApiPageResponse<RESP>> => {
  return fetch<ApiPageResponse<RESP>>({
    url: config.url,
    baseURL: config.baseURL,
    method: 'post',
    headers: config.headers,
    params: extend(config.params, config.page, config.sort),
    data: { body: toSnakeObject(config.data) },
    contentType: config.contentType,
    responseType: config.responseType,
    timeout: config.timeout
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
): ((data: FormData, params?: PARAM, onProgress?: ApiUploadConfig['onProgress']) => Promise<ApiResponse<RESP>>) => {
  return (data: FormData, param?: PARAM, onProgress?: ApiUploadConfig['onProgress']): Promise<ApiResponse<RESP>> => {
    return upload<RESP>({ ...config, params: extend({}, defaultParam, param), data, onProgress: onProgress ?? config.onProgress })
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

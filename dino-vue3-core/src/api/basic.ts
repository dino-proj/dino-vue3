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
export const fetch = <Type>({ url, method, headers, params, data, contentType, responseType, timeout, onProgress, baseURL }: ApiFetchConfig): Promise<Type> => {
  return useRequest()({
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
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error(res.statusText)
    }
    // 读取data，转换对象的key为驼峰形式
    return toCamleObject(res.data)
  })
}

/**
 * 上传函数
 * @param config 请求配置信息
 * @returns Promise对象
 */
export const upload = <Type>(config: ApiUploadConfig): Promise<ApiResponse<Type>> => {
  return fetch<ApiResponse<Type>>({
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
export const get = <Type>(config: ApiGetConfig): Promise<ApiResponse<Type>> => {
  return fetch<ApiResponse<Type>>({
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
export const post = <Type>(config: ApiPostConfig): Promise<ApiResponse<Type>> => {
  return fetch<ApiResponse<Type>>({
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
 * @param config 请求配置信息
 * @returns
 */
export const getPage = <Type>(config: ApiGetConfig & { page: Pageable; sort?: Sortable }): Promise<ApiPageResponse<Type>> => {
  return fetch<ApiPageResponse<Type>>({
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
export const postPage = <Type>(config: ApiPostConfig & { page: Pageable; sort?: Sortable }): Promise<ApiPageResponse<Type>> => {
  return fetch<ApiPageResponse<Type>>({
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
 * @param <R> 返回类型
 * @param <T> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个请求函数
 */
export const defineUploadApi = <R = any, T = ApiParamType>(
  config: Omit<ApiUploadConfig, 'params' | 'data'>,
  defaultParam?: Partial<T>
): ((data: FormData, params?: T, onProgress?: ApiUploadConfig['onProgress']) => Promise<ApiResponse<R>>) => {
  return (data: FormData, param?: T, onProgress?: ApiUploadConfig['onProgress']): Promise<ApiResponse<R>> => {
    return upload<R>({ ...config, params: extend({}, defaultParam, param), data, onProgress: onProgress ?? config.onProgress })
  }
}

/**
 * 定义一个Get函数
 * @param <R> 返回类型
 * @param <D> Form数据的类型
 * @param <T> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个请求函数
 */
export const defineGetApi = <R = any, T = ApiParamType>(config: Omit<ApiGetConfig, 'params'>, defaultParam?: Partial<T>): ((params?: T) => Promise<ApiResponse<R>>) => {
  return (param?: T): Promise<ApiResponse<R>> => {
    return get<R>({ ...config, params: extend({}, defaultParam, param) })
  }
}

/**
 * 定义一个分页Get函数
 * @param <R> 返回类型
 * @param <T> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个分页请求函数
 */
export const defineGetPageApi = <R = any, T = ApiParamType>(
  config: Omit<ApiGetConfig, 'params'>,
  defaultParam?: Partial<T>
): ((params: T, page: Pageable, sort?: Sortable) => Promise<ApiPageResponse<R>>) => {
  return (params: T, page: Pageable, sort?: Sortable): Promise<ApiPageResponse<R>> => {
    return getPage<R>({ ...config, params: extend({}, defaultParam, params), page, sort })
  }
}

/**
 * 定义一个Post函数
 * @param <R> 返回类型
 * @param <D> Post数据的类型
 * @param <T> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个请求函数
 */
export const definePostApi = <R = any, D = ApiParamType, T = ApiParamType>(
  config: Omit<ApiPostConfig, 'params' | 'data'>,
  defaultParam?: Partial<T>
): ((data: D, params?: T) => Promise<ApiResponse<R>>) => {
  return (data: D, param?: T): Promise<ApiResponse<R>> => {
    return post<R>({ ...config, params: extend({}, defaultParam, param), data })
  }
}

/**
 * 定义一个分页Post函数
 * @param <R> 返回类型
 * @param <D> Post数据的类型
 * @param <T> 请求参数的类型
 * @param config 请求的配置信息
 * @param defaultParam 请求的默认参数
 * @returns 一个分页请求函数
 */
export const definePostPageApi = <R, D = ApiParamType, T = ApiParamType>(
  config: Omit<ApiPostConfig, 'params' | 'data'>,
  defaultParam?: Partial<T>
): ((data: D, page: Pageable, params?: T, sort?: Sortable) => Promise<ApiPageResponse<R>>) => {
  return (data: D, page: Pageable, param?: T, sort?: Sortable): Promise<ApiPageResponse<R>> => {
    return postPage<R>({ ...config, params: extend({}, defaultParam, param), data, page, sort })
  }
}

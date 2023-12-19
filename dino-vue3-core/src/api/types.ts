// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

export type ApiParamType = Record<string, any>

/**
 * http请求头类型
 */
export type ApiHeaderType = Record<string, string | string[] | number | boolean | null>

/**
 * 基础认证类型
 */
export interface BasicCredentials {
  username: string
  password: string
}

export interface ProxyConfig {
  host: string
  port: number
  auth?: BasicCredentials
  protocol?: string
}

export interface RequestProgressEvent {
  loaded: number
  total?: number
  progress?: number
  bytes: number
  rate?: number
  estimated?: number
  upload?: boolean
  download?: boolean
  event?: any
}

export type RequestMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT'

export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export interface RequestConfig<D = any> {
  url?: string
  method?: RequestMethod | string
  baseURL?: string
  headers?: ApiHeaderType
  params?: any
  data?: D
  timeout?: number
  withCredentials?: boolean
  auth?: BasicCredentials
  responseType?: ResponseType
  responseEncoding?: string
  onUploadProgress?: (progressEvent: RequestProgressEvent) => void
  onDownloadProgress?: (progressEvent: RequestProgressEvent) => void
  socketPath?: string | null
  transport?: any
  proxy?: ProxyConfig | false
}

export interface HttpResponse<T = any, D = any> {
  data: T
  status: number
  statusText: string
  headers: ApiHeaderType
  config: RequestConfig<D>
  request?: ApiReqeust
}

/**
 * Api请求函数类型
 */
export interface ApiReqeust {
  <T = any, R = HttpResponse<T>, D = any>(config: RequestConfig<D>): Promise<R>
  <T = any, R = HttpResponse<T>, D = any>(url: string, config?: RequestConfig<D>): Promise<R>
}

/**
 * Get请求的配置类型
 *
 * @example
 * const config: ApiGetConfig = {
 *  url: '/user/info',
 *  headers: {
 *   'X-Token': 'xxxxx'
 *  },
 *  params: {
 *   id: 1,
 *   name: 'dinos'
 *  }
 * }
 */
export interface ApiGetConfig {
  url: string
  headers?: ApiHeaderType
  params?: ApiParamType
  responseType?: ResponseType
  timeout?: number
  baseURL?: string
}

/**
 * Post 请求的配置类型
 */
export interface ApiPostConfig extends ApiGetConfig {
  data?: ApiParamType
  contentType?: string
}

/**
 * 上传文件Api的配置类型
 */
export interface ApiUploadConfig extends ApiGetConfig {
  data: FormData
  method?: 'post' | 'put'
  onProgress?: (progress: RequestProgressEvent) => void
}

/**
 * Fetch请求
 */
export interface ApiFetchConfig extends Omit<ApiPostConfig, 'data'> {
  method: 'get' | 'post' | 'delete' | 'put'
  data?: ApiParamType | FormData
  onProgress?: (progress: RequestProgressEvent) => void
}

/**
 * 分页参数类型
 */
export interface Pageable {
  /**
   * 页码，第一页是’0‘
   */
  pn: number

  /**
   * 每页的长度
   */
  pl: number
}

/**
 * 排序参数类型
 */
export interface Sortable {
  /**
   * 排序，格式为: property(:asc|desc)。 默认按照asc升序， 支持多维度排序
   *
   * @example
   * // 按照age升序
   * sort: 'age'
   *
   * // 按照age升序，name降序
   * sort: ['age', 'name:desc']
   */
  sort?: string | string[]
}

/**
 * 游标参数类型
 */
export interface Cursorable {
  /**
   * 游标，用于分页查询
   */
  cursor?: string

  /**
   * 游标长度，用于分页查询
   */
  pl?: number
}

/**
 * Api请求响应类型
 */
export interface ApiResponse<DataType> {
  code: number
  msg: string
  cost: number
  data: DataType
}

/**
 * 分页API请求响应类型
 *
 * @example
 * const res: ApiPageResponse<User> = {
 *  code: 0,
 *  msg: 'success',
 *  cost: 100,
 *  data: [ { id: 1, name: 'dinos' } ],
 *  total: 1,
 *  totalPage: 1,
 *  pn: 0,
 *  pl: 10
 * }
 */
export interface ApiPageResponse<DataType> extends ApiResponse<DataType[]>, Pageable {
  /**
   * 总记录数
   */
  total: number

  /**
   * 总页数
   */
  totalPage: number
}

/**
 * 滑动窗口Api请求结果类型
 */
export interface ApiScrollResponse<DataType> extends ApiResponse<DataType[]> {
  /**
   * 是否还有下一页
   */
  hasMore: boolean

  /**
   * 下次请求游标
   */
  cursor?: string

  /**
   * 本次请求返回数据条数
   */
  count?: number

  /**
   * 游标长度，用于分页查询
   */
  pl?: number
}

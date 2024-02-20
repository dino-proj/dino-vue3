// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

/**
 * Api请求参数类型
 */
export type ApiParamType = Record<string, any>

/**
 * http请求头类型
 */
export type HttpHeaderType = Record<string, string | string[] | number | boolean | null>

/**
 * 基础认证类型
 */
export interface BasicCredentials {
  /**
   * 用户名
   */
  username: string

  /**
   * 密码
   */
  password: string
}

export interface ProxyConfig {
  /**
   * 代理主机
   */
  host: string

  /**
   * 代理端口
   */
  port: number

  /**
   * 代理授权信息
   */
  auth?: BasicCredentials

  /**
   * 代理协议
   * @default http
   */
  protocol?: 'http' | 'https' | 'socks4' | 'socks5'
}

export interface RequestProgressEvent {
  /**
   * 上传或下载的字节数
   */
  loaded: number

  /**
   * 总字节数
   */
  total?: number

  /**
   * 上传或下载进度(%)，0-100
   */
  progress?: number

  /**
   * 上传或下载速率，单位为字节/秒
   */
  bytes: number

  /**
   * 上传或下载速率，单位为字节/秒
   */
  rate?: number

  /**
   * 上传或下载剩余时间，单位为秒
   */
  estimated?: number

  /**
   * 是否为上传
   */
  upload?: boolean

  /**
   * 是否为下载
   */
  download?: boolean

  /**
   * 事件对象
   */
  event?: any
}

/**
 * 进度回调函数类型, 用于定义上传或下载进度回调函数
 */
export interface OnProgressHandler {
  /**
   * 上传进度回调函数
   */
  onUploadProgress?: (progressEvent: RequestProgressEvent) => void

  /**
   * 下载进度回调函数
   */
  onDownloadProgress?: (progressEvent: RequestProgressEvent) => void
}

export type RequestMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT'

export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

/**
 * 请求接口的配置类型
 * @template D 请求数据的类型，默认为 any
 */
export interface RequestConfig<D = any> extends OnProgressHandler {
  /**
   * 请求的 URL
   */
  url: string

  /**
   * 请求的方法
   */
  method: RequestMethod | string

  /**
   * 请求的基础 URL
   */
  baseUrl?: string

  /**
   * 请求的头部信息
   */
  headers?: HttpHeaderType

  /**
   * 请求的参数
   */
  params?: any

  /**
   * 请求的数据
   */
  data?: D

  /**
   * 请求的超时时间
   */
  timeout?: number

  /**
   * 是否携带凭证
   */
  withCredentials?: boolean

  /**
   * 基本认证凭证
   */
  auth?: BasicCredentials

  /**
   * 是否需要身份验证令牌
   * - undifined || true: 需要
   * - false: 不需要
   * @default - undifined
   */
  withToken?: boolean

  /**
   * 响应的数据类型
   */
  responseType?: ResponseType

  /**
   * 响应的编码方式
   */
  responseEncoding?: string

  /**
   * Socket 路径
   */
  socketPath?: string | null

  /**
   * 传输方式
   */
  transport?: any

  /**
   * 代理配置
   */
  proxy?: ProxyConfig | false
}

/**
 * HTTP响应接口
 * @template RESP_T 响应数据类型
 */
export interface HttpResponse<RESP_T = any> {
  /**
   * 响应数据
   */
  data: RESP_T

  /**
   * 响应状态码
   */
  status: number

  /**
   * 响应状态文本
   */
  statusText: string

  /**
   * 响应头部信息
   */
  headers: HttpHeaderType
}

/**
 * Api请求函数类型
 */
export interface HttpRequest {
  <T = any, R = HttpResponse<T>, D = any>(config: RequestConfig<D>): Promise<R>
  <T = any, R = HttpResponse<T>, D = any>(url: string, config?: RequestConfig<D>): Promise<R>
}

/**
 * ApiGetConfig 接口用于定义 api 请求的配置项。
 */
export interface ApiRequestConfig extends Omit<RequestConfig, 'param'> {
  /**
   * 请求所属的api服务名称。
   */
  service?: string

  /**
   * 请求的参数。
   */
  params?: ApiParamType

  /**
   * 发送数据的内容类型
   * @default 'application/json'
   */
  contentType?: string
}

/**
 * ApiGetConfig 接口用于定义 GET 请求的配置项。
 * @extends RequestConfig
 */
export interface ApiGetConfig<PARAM = ApiParamType> extends Omit<ApiRequestConfig, 'method' | 'data' | 'params'> {
  /**
   * 请求的参数。
   */
  params?: PARAM
}

/**
 * ApiPostConfig 接口用于定义 POST 请求的配置项。
 * @extends ApiRequestConfig
 */
export interface ApiPostConfig<DATA = ApiParamType, PARAM = ApiParamType> extends ApiGetConfig<PARAM> {
  /**
   * 请求的数据。
   */
  data: DATA
}

/**
 * 上传文件Api的配置类型
 */
export interface ApiUploadConfig<PARAM = ApiParamType> extends ApiGetConfig<PARAM> {
  /**
   * 上传的数据
   */
  data: FormData

  /**
   * 请求方法，可选值为 'post' 或 'put'
   * @default 'post'
   */
  method?: 'post' | 'put'
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
/**
 * 表示 API 响应的接口。
 * @template DataType - 数据类型参数。
 */
export interface ApiResponse<DataType> {
  /**
   * 响应的状态码。
   */
  code: number

  /**
   * 响应的消息。
   */
  msg: string

  /**
   * 响应的耗时，单位ms。
   */
  cost: number

  /**
   * 响应的数据。
   */
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

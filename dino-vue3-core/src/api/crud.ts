// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { extend, isFunction, join } from 'lodash-es'
import { ApiPageResponse, ApiParamType, ApiResponse, Pageable, Sortable } from './types'
import { get, post, postPage } from './basic'
import { IdKeyType, VoBase } from '../common'
import { asArray } from '../utils'

/**
 * 编辑参数类型，去掉<T>中的id和VoBase中的字段
 * @param <T> 编辑参数类型
 * @param <EXTRA_PROPS> 其他要排除的字段
 */
export type ToEditType<T, EXTRA_PROPS extends keyof any = never> = Omit<T, EXTRA_PROPS & 'id' & keyof VoBase<IdKeyType>>

/**
 * List接口类型
 * @param <RESP> 返回类型
 * @param <QUERY> 查询参数类型
 * @returns Promise<ApiPageResponse<RESP>>对象
 */
export type ListApi<RESP, QUERY = ApiParamType> = <T = RESP>(data: QUERY, page: Pageable, sort?: Sortable) => Promise<ApiPageResponse<T>>

/**
 * Get接口类型
 * @param <RESP> 返回类型
 * @returns Promise<ApiResponse<RESP>>对象
 */
export type GetOneApi<RESP> = <T = RESP>(id: IdKeyType) => Promise<ApiResponse<T>>

/**
 * Add接口类型
 * @param <RESP> 返回类型
 * @param <EDIT> 添加参数类型，默认：RESP去掉id和VoBase中的字段
 * @returns Promise<ApiResponse<RESP>>对象
 */
export type AddOneApi<RESP, EDIT = ToEditType<RESP>> = <T = RESP>(data: EDIT) => Promise<ApiResponse<T>>

/**
 * Update接口类型
 * @param <RESP> 返回类型
 * @param <EDIT> 编辑参数类型，默认：RESP去掉id和VoBase中的字段
 * @returns Promise<ApiResponse<RESP>>对象
 */
export type UpdateOneApi<RESP, EDIT = ToEditType<RESP>> = <T = RESP>(id: IdKeyType, data: EDIT) => Promise<ApiResponse<T>>

/**
 * Delete接口类型
 * @returns Promise<ApiResponse<boolean>>对象
 */
export type DeleteApi = (ids: IdKeyType[] | IdKeyType) => Promise<ApiResponse<boolean>>

/**
 * ChangeStatus接口类型
 * @returns Promise<ApiResponse<boolean>>对象
 */
export type ChangeStatusApi = (ids: IdKeyType[] | IdKeyType, status: string) => Promise<ApiResponse<boolean>>

/**
 * 增删改查API类型
 */
export interface CrudAPI<RESP, QUERY = ApiParamType, EDIT = ToEditType<RESP>> {
  /**
   * 获取单个类型
   */
  getOne: GetOneApi<RESP>

  /**
   * 获取一页数据
   */
  listPage: ListApi<RESP, QUERY>

  /**
   * 添加一个Entity
   */
  addOne: AddOneApi<RESP, EDIT>

  /**
   * 更新一个对象
   */
  updateOne: UpdateOneApi<RESP, EDIT>

  /**
   * 删除一个或多个Entity
   */
  delete: DeleteApi

  /**
   * 改变Entity的状态
   */
  changeStatus: ChangeStatusApi
}

/**
 * 增删改查API配置类型
 */
export interface CrudApiConfig<RESP, QUERY = ApiParamType, EDIT = ToEditType<RESP>> {
  /**
   * API路径
   * @example
   * > 假设API地址为：http://localhost:8080/api/user
   * > baseUrl为：/api
   * > 则path为：/user
   */
  path?: string

  /**
   * list接口
   *
   * @example
   * string类型时，会自动拼接到path后面，如：/user/list
   * > 假设API地址为：http://localhost:8080/api/user
   * > list为：/list
   * > 则最终API地址为：http://localhost:8080/api/user/list
   *
   * 或者，直接为一个函数，如：
   * > list为：(data: any, page: Pageable) => Promise<ApiPageResponse<User>>
   * > 则由用户自己实现list接口返回结果
   */
  list?: string | ListApi<RESP, QUERY>

  /**
   * get接口
   *
   * @example
   * string类型时，会自动拼接到path后面，如：/user/id
   * > 假设API地址为：http://localhost:8080/api/user
   * > get为：/id
   * > 则最终API地址为：http://localhost:8080/api/user/id
   *
   * 或者，直接为一个函数，如：
   * > get为：(id: IdKeyType) => Promise<ApiResponse<User>>
   * > 则由用户自己实现get接口返回结果
   */
  get?: string | GetOneApi<RESP>

  /**
   * add接口
   *
   * @example
   * string类型时，会自动拼接到path后面，如：/user/add
   * > 假设API地址为：http://localhost:8080/api/user
   * > add为：/add
   * > 则最终API地址为：http://localhost:8080/api/user/add
   *
   * 或者，直接为一个函数，如：
   * > add为：(data: User) => Promise<ApiResponse<User>>
   * > 则由用户自己实现add接口返回结果
   */
  add?: string | AddOneApi<RESP, EDIT>

  /**
   * update接口
   *
   * @example
   * string类型时，会自动拼接到path后面，如：/user/update
   * > 假设API地址为：http://localhost:8080/api/user
   * > update为：/update
   * > 则最终API地址为：http://localhost:8080/api/user/update
   *
   * 或者，直接为一个函数，如：
   * > update为：(id: IdKeyType, data: User) => Promise<ApiResponse<User>>
   * > 则由用户自己实现update接口返回结果
   */
  update?: string | UpdateOneApi<RESP, EDIT>

  /**
   * delete接口
   *
   * @example
   * string类型时，会自动拼接到path后面，如：/user/delete
   * > 假设API地址为：http://localhost:8080/api/user
   * > delete为：/delete
   * > 则最终API地址为：http://localhost:8080/api/user/delete
   *
   * 或者，直接为一个函数，如：
   * > delete为：(ids: IdKeyType[] | IdKeyType) => Promise<ApiResponse<boolean>>
   * > 则由用户自己实现delete接口返回结果
   */
  delete?: string | DeleteApi

  /**
   * status接口
   *
   * @example
   * string类型时，会自动拼接到path后面，如：/user/status
   * > 假设API地址为：http://localhost:8080/api/user
   * > status为：/status
   * > 则最终API地址为：http://localhost:8080/api/user/status
   *
   * 或者，直接为一个函数，如：
   * > status为：(ids: IdKeyType[] | IdKeyType, status: string) => Promise<ApiResponse<boolean>>
   * > 则由用户自己实现status接口返回结果
   */
  status?: string | ChangeStatusApi
}

/**
 * 定义一个List接口
 * @param <RESP> 返回类型
 * @param <QUERY> 查询参数类型
 * @returns ListApi<RESP, QUERY>函数
 */
export const defineListApi = <RESP, QUERY = ApiParamType>(url: string, defaultParam?: ApiParamType): ListApi<RESP, QUERY> => {
  return <T = RESP>(data: QUERY, page: Pageable, sort?: Sortable): Promise<ApiPageResponse<T>> => {
    return postPage<T>({ url, params: extend({}, defaultParam), data, page, sort })
  }
}

/**
 * 定义一个Get接口
 * @param <RESP> 返回类型
 * @returns GetOneApi<RESP>函数
 */
export const defineGetOneApi = <RESP = any>(url: string): GetOneApi<RESP> => {
  return <T = RESP>(id: IdKeyType): Promise<ApiResponse<T>> => {
    return get<T>({ url, params: extend({}, { id }) })
  }
}

/**
 * 定义一个Add接口
 * @param <RESP> 返回类型
 * @param <EDIT> 添加参数类型，默认：RESP去掉id和VoBase中的字段
 * @returns AddOneApi<RESP, EDIT>函数
 */
export const defineAddOneApi = <RESP, EDIT = ToEditType<RESP>>(url: string): AddOneApi<RESP, EDIT> => {
  return <T = RESP>(data: EDIT): Promise<ApiResponse<T>> => {
    return post<T>({ url, data })
  }
}

/**
 * 定义一个Update接口
 * @param <RESP> 返回类型
 * @param <EDIT> 编辑参数类型，默认：RESP去掉id和VoBase中的字段
 * @returns UpdateOneApi<RESP, EDIT>函数
 */
export const defineUpdateOneApi = <RESP, EDIT = ToEditType<RESP>>(url: string): UpdateOneApi<RESP, EDIT> => {
  return <T = RESP>(id: IdKeyType, data: EDIT): Promise<ApiResponse<T>> => {
    return post<T>({ url, params: { id }, data })
  }
}

/**
 * 定义一个Delete接口
 * @returns DeleteApi函数
 */
export const defineDeleteApi = (url: string): DeleteApi => {
  return (ids: IdKeyType[] | IdKeyType): Promise<ApiResponse<boolean>> => {
    return get<boolean>({ url, params: { ids: join(asArray(ids), ',') } })
  }
}

/**
 * 定义一个ChangeStatus接口
 * @returns ChangeStatusApi函数
 */
export const defineChangeStatusApi = (url: string): ChangeStatusApi => {
  return (ids: IdKeyType[] | IdKeyType, status: string): Promise<ApiResponse<boolean>> => {
    return post<boolean>({ url, params: { ids: join(asArray(ids), ','), status: status } })
  }
}

/**
 * 定义一个增删改查API
 * @param <RESP> 返回类型
 * @param <QUERY> 查询参数类型
 * @param <EDIT> 编辑(添加/更新)参数类型
 * @param config 配置信息
 * @param defaultParam API默认参数
 * @returns
 */
export const defineCrudApi = <RESP, QUERY = ApiParamType, EDIT = RESP>(config: CrudApiConfig<RESP, QUERY, EDIT>, defaultParam?: ApiParamType): CrudAPI<RESP, QUERY, EDIT> => {
  const getFn = isFunction(config.get) ? config.get : defineGetOneApi<RESP>(`${config.path || ''}/${config.get || 'id'}`)

  const listFn = isFunction(config.list) ? config.list : defineListApi<RESP, QUERY>(`${config.path || ''}/${config.list || 'list'}`, defaultParam)

  const addFn = isFunction(config.add) ? config.add : defineAddOneApi<RESP, EDIT>(`${config.path || ''}/${config.add || 'add'}`)

  const updateFn = isFunction(config.update) ? config.update : defineUpdateOneApi<RESP, EDIT>(`${config.path || ''}/${config.update || 'update'}`)

  const delsFn = isFunction(config.delete) ? config.delete : defineDeleteApi(`${config.path || ''}/${config.delete || 'delete'}`)

  const changeStatusFn = isFunction(config.status) ? config.status : defineChangeStatusApi(`${config.path || ''}/${config.status || 'status'}`)

  return {
    getOne: getFn,
    listPage: listFn,
    addOne: addFn,
    updateOne: updateFn,
    delete: delsFn,
    changeStatus: changeStatusFn
  }
}

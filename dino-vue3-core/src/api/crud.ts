// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { extend, isFunction, join } from 'lodash-es'
import { ApiPageResponse, ApiParamType, ApiResponse, Pageable, Sortable } from './types'
import { get, post, postPage } from './basic'
import { IdKeyType } from '../common'
import { asArray } from '../utils'

/**
 * 增删改查API类型
 */
export interface CrudAPI<RESP, QUERY = ApiParamType, EDIT = RESP> {
  /**
   * 获取单个类型
   */
  getOne: <T = RESP>(id: IdKeyType) => Promise<ApiResponse<T>>

  /**
   * 获取一页数据
   */
  listPage: <T = RESP>(data: QUERY, page: Pageable, sort?: Sortable) => Promise<ApiPageResponse<T>>

  /**
   * 添加一个Entity
   */
  addOne: <T = RESP>(data: EDIT) => Promise<ApiResponse<T>>

  /**
   * 删除一个或多个Entity
   */
  delete: (ids: IdKeyType[] | IdKeyType) => Promise<ApiResponse<boolean>>

  /**
   * 改变Entity的状态
   */
  changeStatus: (ids: IdKeyType[] | IdKeyType, status: string) => Promise<ApiResponse<boolean>>

  /**
   * 更新一个对象
   */
  updateOne: <T = RESP>(id: IdKeyType, data: EDIT) => Promise<ApiResponse<T>>
}

/**
 * 增删改查API配置类型
 */
export interface CrudApiConfig<RESP, QUERY = ApiParamType, EDIT = RESP> {
  /**
   * API路径
   * @example
   * // 假设API地址为：http://localhost:8080/api/user
   * // basePath为：/api
   * // 则path为：/user
   */
  path?: string

  /**
   * list接口
   *
   * @example
   * string类型时，会自动拼接到path后面，如：/user/list
   * // 假设API地址为：http://localhost:8080/api/user
   * // list为：/list
   * // 则最终API地址为：http://localhost:8080/api/user/list
   *
   * 或者，直接为一个函数，如：
   * // list为：(data: any, page: Pageable) => Promise<ApiPageResponse<User>>
   * // 则由用户自己实现list接口返回结果
   */
  list?: string | CrudAPI<RESP, QUERY, EDIT>['listPage']
  get?: string | CrudAPI<RESP, QUERY, EDIT>['getOne']
  add?: string | CrudAPI<RESP, QUERY, EDIT>['addOne']
  delete?: string | CrudAPI<RESP, QUERY, EDIT>['delete']
  status?: string | CrudAPI<RESP, QUERY, EDIT>['changeStatus']
  update?: string | CrudAPI<RESP, QUERY, EDIT>['updateOne']
}

/**
 * 定义一个增删改查API
 * @param config 配置信息
 * @param defaultParam API默认参数
 * @returns
 */
export const defineCrudApi = <RESP, QUERY = ApiParamType, EDIT = RESP>(config: CrudApiConfig<RESP, QUERY, EDIT>, defaultParam?: ApiParamType): CrudAPI<RESP, QUERY, EDIT> => {
  const getFn = isFunction(config.get)
    ? config.get
    : <T = RESP>(id: string | number): Promise<ApiResponse<T>> => {
        return get<T>({ url: `${config.path || ''}/${config.get || 'id'}`, params: extend({}, defaultParam, { id }) })
      }

  const listFn = isFunction(config.list)
    ? config.list
    : <T = RESP>(data: QUERY, page: Pageable, sort?: Sortable): Promise<ApiPageResponse<T>> => {
        return postPage<T>({ url: `${config.path || ''}/${config.list || 'list'}`, params: extend({}, defaultParam), data, page, sort })
      }

  const addFn = isFunction(config.add)
    ? config.add
    : <T = RESP>(data: EDIT): Promise<ApiResponse<T>> => {
        return post<T>({ url: `${config.path || ''}/${config.add || 'add'}`, params: extend({}, defaultParam), data })
      }

  const updateFn = isFunction(config.update)
    ? config.update
    : <T = RESP>(id: IdKeyType, data: EDIT): Promise<ApiResponse<T>> => {
        return post<T>({ url: `${config.path || ''}/${config.update || 'update'}`, params: extend({}, defaultParam, { id }), data })
      }

  const changeStatusFn = isFunction(config.status)
    ? config.status
    : (ids: IdKeyType[] | IdKeyType, status: string): Promise<ApiResponse<boolean>> => {
        return post<boolean>({ url: `${config.path || ''}/${config.status || 'status'}`, params: extend({}, defaultParam, { ids: join(asArray(ids), ','), status: status }) })
      }

  const delsFn = isFunction(config.delete)
    ? config.delete
    : (ids: IdKeyType[] | IdKeyType): Promise<ApiResponse<boolean>> => {
        return get<boolean>({ url: `${config.path || ''}/${config.delete || 'delete'}`, params: extend({}, defaultParam, { ids: join(asArray(ids), ',') }) })
      }

  return {
    getOne: getFn,
    listPage: listFn,
    addOne: addFn,
    updateOne: updateFn,
    delete: delsFn,
    changeStatus: changeStatusFn
  }
}

// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { extend, isFunction, join } from 'lodash-es'
import { ApiPageResponse, ApiParamType, ApiResponse, Pageable, Sortable } from './types'
import { get, post, postPage } from './basic'

/**
 * 增删改查API类型
 */
export interface CrudAPI<Type = any> {
  /**
   * 获取单个类型
   */
  getOne: <T = Type>(id: string | number) => Promise<ApiResponse<T>>

  /**
   * 获取一页数据
   */
  listPage: <T = Type>(data: ApiParamType, page: Pageable, sort?: Sortable) => Promise<ApiPageResponse<T>>

  /**
   * 添加一个Entity
   */
  addOne: <T = Type>(data: ApiParamType) => Promise<ApiResponse<T>>

  /**
   * 删除一个或多个Entity
   */
  delete: (ids: string[] | string) => Promise<ApiResponse<boolean>>

  /**
   * 改变Entity的状态
   */
  changeStatus: (ids: string[] | string, status: string) => Promise<ApiResponse<boolean>>

  /**
   * 更新一个对象
   */
  updateOne: <T = Type>(id: string, data: ApiParamType) => Promise<ApiResponse<T>>
}

/**
 * 增删改查API配置类型
 */
export interface CrudApiConfig<Type> {
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
  list?: string | CrudAPI<Type>['listPage']
  get?: string | CrudAPI<Type>['getOne']
  add?: string | CrudAPI<Type>['addOne']
  delete?: string | CrudAPI<Type>['delete']
  status?: string | CrudAPI<Type>['changeStatus']
  update?: string | CrudAPI<Type>['updateOne']
}

/**
 * 定义一个增删改查API
 * @param config 配置信息
 * @param defaultParam API默认参数
 * @returns
 */
export const defineCrudApi = <Type>(config: CrudApiConfig<Type>, defaultParam?: ApiParamType): CrudAPI<Type> => {
  const getFn = isFunction(config.get)
    ? config.get
    : <T = Type>(id: string | number): Promise<ApiResponse<T>> => {
        return get<T>({ url: `${config.path || ''}/${config.get || 'id'}`, params: extend({}, defaultParam, { id }) })
      }

  const listFn = isFunction(config.list)
    ? config.list
    : <T = Type>(data: ApiParamType, page: Pageable, sort?: Sortable): Promise<ApiPageResponse<T>> => {
        return postPage<T>({ url: `${config.path || ''}/${config.list || 'list'}`, params: extend({}, defaultParam), data, page, sort })
      }

  const addFn = isFunction(config.add)
    ? config.add
    : <T = Type>(data: ApiParamType): Promise<ApiResponse<T>> => {
        return post<T>({ url: `${config.path || ''}/${config.add || 'add'}`, params: extend({}, defaultParam), data })
      }

  const updateFn = isFunction(config.update)
    ? config.update
    : <T = Type>(id: string, data: ApiParamType): Promise<ApiResponse<T>> => {
        return post<T>({ url: `${config.path || ''}/${config.update || 'update'}`, params: extend({}, defaultParam, { id }), data })
      }

  const changeStatusFn = isFunction(config.status)
    ? config.status
    : (ids: string[] | string, status: string): Promise<ApiResponse<boolean>> => {
        return post<boolean>({ url: `${config.path || ''}/${config.status || 'status'}`, params: extend({}, defaultParam, { ids: join(ids, ','), status: status }) })
      }

  const delsFn = isFunction(config.delete)
    ? config.delete
    : (ids: string[] | string): Promise<ApiResponse<boolean>> => {
        return get<boolean>({ url: `${config.path || ''}/${config.delete || 'delete'}`, params: extend({}, defaultParam, { ids: join(ids, ',') }) })
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

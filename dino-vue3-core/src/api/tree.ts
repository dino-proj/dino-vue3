// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { get, postPage } from './basic'
import { ApiPageResponse, ApiParamType, ApiResponse, Pageable } from './types'

/**
 * 定义树访问接口
 */
export interface TreeApi<Type = any> {
  /**
   * 获取树数据
   * @param parentId 父节点ID
   * @returns 返回树数据的Promise
   */
  getTree: (parentId: string | number) => Promise<ApiResponse<Type>>

  /**
   * 获取选择器树数据
   * @param parentId 父节点ID
   * @returns 返回选择器树数据的Promise
   */
  getPickerTree: (parentId: string | number) => Promise<ApiResponse<Type>>

  /**
   * 搜索树数据
   * @param data 搜索条件
   * @param page 分页信息
   * @returns 返回搜索结果的Promise
   */
  getSearch: (data: object, page: Pageable) => Promise<ApiPageResponse<Type>>

  /**
   * 获取选项数据
   * @param data 请求参数
   * @param page 分页信息
   * @returns 返回选项数据的Promise
   */
  getOptions?: (data: ApiParamType, page: Pageable) => Promise<ApiPageResponse<Type>>
}

/**
 * 定义树访问接口
 */
export const defineTreeApi = <Type = any>(path: string, service?: string): TreeApi<Type> => {
  const getTree = (parentId: string | number) => {
    return get<Type>({ service, url: `${path}/tree`, params: { parentId } })
  }

  const getPickerTree = (parentId: string | number) => {
    return get<Type>({ service, url: `${path}/picker-tree`, params: { parentId } })
  }

  const getSearch = (data: object, page: Pageable) => {
    return postPage<Type>({ service, url: `${path}/search`, data, page })
  }

  const getOptions = (data: ApiParamType, page: Pageable) => {
    return postPage<Type>({ service, url: `${path}/options`, data, page })
  }

  return {
    getTree,
    getPickerTree,
    getSearch,
    getOptions
  }
}

// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { get, postPage } from './basic'
import { ApiPageResponse, ApiParamType, ApiResponse, Pageable } from './types'

/**
 * 定义树访问接口
 */
export interface TreeApi<Type = any> {
  getTree: (parentId: string | number) => Promise<ApiResponse<Type>>
  getPickerTree: (parentId: string | number) => Promise<ApiResponse<Type>>
  getSearch: (data: object, page: Pageable) => Promise<ApiPageResponse<Type>>
  getOptions?: (data: ApiParamType, page: Pageable) => Promise<ApiPageResponse<Type>>
}

export const defineTreeApi = <Type = any>(path: string): TreeApi<Type> => {
  const getTree = (parentId: string | number) => {
    return get<Type>({ url: `${path}/tree`, params: { parentId } })
  }

  const getPickerTree = (parentId: string | number) => {
    return get<Type>({ url: `${path}/picker-tree`, params: { parentId } })
  }

  const getSearch = (data: object, page: Pageable) => {
    return postPage<Type>({ url: `${path}/search`, data, page })
  }

  const getOptions = (data: ApiParamType, page: Pageable) => {
    return postPage<Type>({ url: `${path}/options`, data, page })
  }

  return {
    getTree,
    getPickerTree,
    getSearch,
    getOptions
  }
}

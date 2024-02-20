// Copyright 2024 dinodev.cn.
// SPDX-License-Identifier: MIT

import { IdKeyType, User } from '../common'
import { definePostApi } from '../api'
import { DinoLoginAuthInfo, LoginByRefreshTokenApi } from './types'

/**
 * 定义刷新令牌的 API
 * @template K - ID 类型
 * @template U - 用户类型
 * @param {string} path - API 路径
 * @param {string} service - 服务名称
 * @returns {LoginByRefreshTokenApi<K, U>} - 刷新令牌的登录 API
 */
export const defineRefreshTokenApi = <K extends IdKeyType = string, U extends User<K> = User<K>>(path: string, service?: string): LoginByRefreshTokenApi<K, U> => {
  const post = definePostApi<DinoLoginAuthInfo<K, U>, { refreshToken: string }>({
    url: path,
    service,
    withToken: false
  })

  return (refreshToken: string) => post({ refreshToken }).then((res) => res.data)
}

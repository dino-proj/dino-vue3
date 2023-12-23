// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { IdKeyType, Tenant, UserInfo } from '../common'

/**
 * 登录凭证
 */
export interface AuthToken {
  refreshToken: string
  expiresIn: number
  authHeaderName: string
  authPayload: string
}

export interface DinoLoginAuthInfo<K extends IdKeyType = string, U extends UserInfo<K> = UserInfo<K>> {
  currentTenant?: Tenant
  tenantList?: Tenant[]
  user?: U
  authToken: AuthToken
}

export interface AuthApi<T extends DinoLoginAuthInfo<K, U>, K extends IdKeyType = string, U extends UserInfo<K> = UserInfo<K>> {
  loginByToken: (token: AuthToken) => Promise<T>

  logout: () => Promise<boolean>
}

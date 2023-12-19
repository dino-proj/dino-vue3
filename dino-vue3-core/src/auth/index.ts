// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { Tenant, UserInfo } from '../common'

/**
 * 登录凭证
 */
export interface AuthToken {
  refreshToken: string
  expiresIn: number
  authHeaderName: string
  authPayload: string
}

export interface DinoLoginAuthInfo<U extends UserInfo = UserInfo> {
  currentTenant?: Tenant
  tenantList?: Tenant[]
  user?: U
  authToken: AuthToken
}

export interface AuthApi<T extends DinoLoginAuthInfo<U>, U extends UserInfo = UserInfo> {
  loginByToken: (token: AuthToken) => Promise<T>

  logout: () => Promise<boolean>
}

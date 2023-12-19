// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

/**
 * 租户信息
 */
export interface Tenant {
  [K: string]: any
  id: string
  name: string
  logo: string
}

/**
 * 用户信息
 */
export interface UserInfo<K = number> {
  id: K
  userType: string
  displayName: string
  avatarUrl: string
}

// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { IdKeyType, Tenant, User } from '../common'

/**
 * 登录凭证
 */
/**
 * AuthToken 接口定义了认证令牌的结构。
 */
export interface AuthToken {
  /**
   * 刷新令牌。
   */
  refreshToken: string

  /**
   * 令牌过期时间，单位为秒。
   */
  expiresIn: number

  /**
   * 认证头部名称。
   */
  authHeaderName: string

  /**
   * 认证负载。
   */
  authPayload: string
}

/**
 * DinoLoginAuthInfo 接口定义了登录认证信息的结构。
 * @template K - IdKeyType 的类型参数，默认为 string。
 * @template U - User 的类型参数，默认为 User<K>。
 */
export interface DinoLoginAuthInfo<K extends IdKeyType = string, U extends User<K> = User<K>> {
  /**
   * 当前租户信息。
   */
  currentTenant?: Tenant

  /**
   * 租户列表。
   */
  tenantList?: Tenant[]

  /**
   * 用户信息。
   */
  user?: U

  /**
   * 认证令牌。
   */
  authToken: AuthToken
}

/**
 * LoginByRefreshTokenApi 接口定义了使用刷新令牌进行登录的 API 方法。
 * @template K - IdKeyType 的类型参数，默认为 string。
 * @template U - User 的类型参数，默认为 User<K>。
 */
export type LoginByRefreshTokenApi<K extends IdKeyType = string, U extends User<K> = User<K>> = (refreshToken: string) => Promise<DinoLoginAuthInfo<K, U>>

/**
 * LogoutApi 接口定义了登出操作。
 */
export type LogoutApi = () => Promise<boolean>

// Copyright 2024 dinodev.cn.
// SPDX-License-Identifier: MIT

import { definePostApi } from 'src/api'
import { DinoLoginAuthInfo, LoginByRefreshTokenApi } from './types'

export const defineRefreshTokenApi = (path?: string, service?: string): LoginByRefreshTokenApi => {
  const post = definePostApi<DinoLoginAuthInfo, { refreshToken: string }>({
    url: path || '/login/refresh-token',
    service,
    withToken: false
  })

  return (refreshToken: string) => post({ refreshToken }).then((res) => res.data)
}

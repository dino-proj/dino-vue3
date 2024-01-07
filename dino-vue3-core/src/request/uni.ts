// Copyright 2023 dinodev.cn.
// SPDX-License-Identifier: MIT

import { UniAdapter } from 'uniapp-axios-adapter'
import { RequestProvider } from '../api'
import { axiosWithAdapter } from './axios'

export const uniRequestProvider: RequestProvider = axiosWithAdapter(UniAdapter)

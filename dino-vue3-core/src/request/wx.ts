// Copyright 2023 dinodev.cn.
// SPDX-License-Identifier: MIT
import mpAdapter from 'axios-miniprogram-adapter'
import { RequestProvider } from '../api'
import { axiosWithAdapter } from './axios'
import { AxiosAdapter } from 'axios'

export const wxRequestProvider: RequestProvider = axiosWithAdapter(mpAdapter as AxiosAdapter)

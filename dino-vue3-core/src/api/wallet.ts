// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

export interface WalletInfo {
  address: string
  balance: string
  nonce: number
  publicKey: string
  sign: string
}

export interface Bills {
  id: string
  from: string
  to: string
  amount: string
  timestamp: number
  status: string
}

export interface WalletApi {
  getWalletInfo: () => Promise<WalletInfo>
}

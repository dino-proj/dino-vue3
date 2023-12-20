// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT


/**
 * id KEY的类型
 */

export type IdKeyType = string | number
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
export interface UserInfo<K = IdKeyType> {
  /**
   * 用户ID
   */
  id: K

  /**
   * 用户类型
   */
  userType: string

  /**
   * 用户名称
   */
  displayName: string

  /**
   * 用户头像
   */
  avatarUrl: string

  /**
   * 用户所属租户
   */
  tenantId?: string

  /**
   * 用户status
   */
  status: number
}


/**
 * GeoPoint
 */

export interface GeoPoint {
  /**
   * 坐标点：经度
   */
  lon: number

  /**
   * 坐标点：纬度
   */
  lat: number
}

/**
 * 地址信息
 */

export interface Address extends  Partial<GeoPoint> {
  /**
   * 省份
   */
  privince: string

  /**
   * 城市
   */
  city: string

  /**
   * 区域/县
   */
  area: string

  /**
   * 街道
   */
  street: string

  /**
   * 详细地址
   */
  detail: string

}

/**
 * 联系人信息
 */
export interface Contact {
  /**
   * 姓名
   */
  name: string

  /**
   * 手机号
   */
  phone: string
}

/**
 * 地点信息
 */

export interface Place extends Partial<GeoPoint> {
  /**
   * 地点名称
   */
  name: string
}

/**
 * Range类型
 */
export interface Range<T> {
  /**
   * 开始值
   */
  begin: T

  /**
   * 结束值
   */
  end: T
}

/**
 * TimePeriod类型，到毫秒的unix时间戳
 */
export type TimePeriod = Range<number>


/**
 * ValueLabel类型
 */
export interface ValueLabel<T = IdKeyType> {
  /**
   * 值
   */
  value: T

  /**
   * 名称
   */
  label: string
}

/**
 * Option类型
 */
export interface Option<T= IdKeyType> {
  /**
   * 选项值
   */
  value: T

  /**
   * 选项名称
   */
  label: string

  /**
   * 选项图标
   */
  icon?: string

  /**
   * 选项样式
   */
  style?: string

  /**
   * 选项描述
   */
  desc?: string
}

/**
 * OptionGroup类型
 */
export interface OptionGroup<T = string | number> {
  /**
   * 分组名称
   */
  label: string

  /**
   * 分组选项
   */
  options: Option<T>[]

  /**
   * 分组描述
   */
  desc?: string
}


/**
 * 文件Type类型
 */
export type FileType = 'image' | 'video' | 'audio' | 'file' | 'document'

/**
 * 文件Meta信息
 */
export interface FileInfo<FT = FileType> {
  /**
   * 文件名称
   */
  name: string

  /**
   * 文件大小
   */
  size: number

  /**
   * 文件类型
   */
  type: FT

  /**
   * 文件地址
   */
  url: string | string[]
}

/**
 * image文件信息
 */
export interface ImageInfo extends FileInfo<'image'> {
  /**
   * 图片宽度
   */
  width: number

  /**
   * 图片高度
   */
  height: number

  /**
   * 图片编码格式
   */
  format?: string
}

/**
 * video文件信息
 */
export interface VideoInfo extends FileInfo<'video'> {
  /**
   * 视频时长
   */
  duration: number

  /**
   * 视频封面
   */
  cover?: string

  /**
   * 视频宽度
   */
  width: number

  /**
   * 视频画质
   */
  resolution?: string

  /**
   * 视频编码格式
   */
  format?: string
}

/**
 * audio文件信息
 */
export interface AudioInfo extends FileInfo<'audio'> {
  /**
   * 音频时长
   */
  duration: number

  /**
   * 音频编码格式
   */
  format?: string
}

/**
 * document文件信息
 */
export interface DocumentInfo extends FileInfo<'document'> {
  /**
   * 文档页数
   */
  pages?: number

  /**
   * 文档编码格式
   */
  format?: string
}

// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

/**
 * id KEY的类型
 */
export type IdKeyType = string | number

/**
 * Vo基础类型
 */
export interface VoBase<K extends IdKeyType> {
  /**
   * 对象 ID
   */
  id: K

  /**
   * 对象创建时间戳，unix时间戳，到毫秒
   */
  createAt: number

  /**
   * 对象更新时间戳，unix时间戳，到毫秒
   */
  updateAt: number

  /**
   * 对象创建者
   */
  createBy: string
  /**
   * 用户status
   */
  status: number
}

/**
 * 添加VoBase扩展
 */
export type withVoBase<T, K extends IdKeyType> = T & VoBase<K>

/**
 * 可排序对象，带排序码
 */
export interface Orderable {
  /**
   * 排序号
   */
  orderNum?: number
}

/**
 * 添加排序码
 */
export type withOrderable<T> = T & Orderable

/**
 * 租户信息
 */
export interface Tenant {
  /**
   * 其他扩展属性
   */
  [K: string]: any

  /**
   * 租户ID
   */
  id: string

  /**
   * 租户名称
   */
  name: string

  /**
   * 租户简称
   */
  shortName: string

  /**
   * 租户logo
   */
  iconUrl: string
}

/**
 * 分租户，添加租户ID信息
 */
export interface Tenantable {
  /**
   * 租户ID
   */
  tenantId: string
}

/**
 * 添加租户ID
 */
export type withTenantable<T> = T & Tenantable

/**
 * 用户信息
 */
export interface User<K extends IdKeyType> {
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
export interface Address extends Partial<GeoPoint> {
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
   * 联系人姓名
   */
  name: string

  /**
   * 联系人手机号
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
 * @param T 范围类型，如：number、string、Date等
 */
export interface Range<T> {
  /**
   * 开始值，包含，如：[begin, end)；
   * 若begin为null则代表：(+∞, end)
   */
  begin?: T

  /**
   * 结束值，不包含，如：[begin, end]；
   * 若end为null则代表：[begin, +∞)
   */
  end?: T
}

/**
 * TimePeriod类型，到秒的unix时间戳
 */
export type TimePeriod = Range<number>

/**
 * ValueLabel类型
 */
export interface ValueLabel<T extends IdKeyType> {
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
export interface Option<T extends IdKeyType> {
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
export interface OptionGroup<T extends IdKeyType> {
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
export interface FileInfo<FT extends FileType> {
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

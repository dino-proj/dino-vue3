// Copyright 2023 dinosdev.cn.
// SPDX-License-Identifier: MIT

import { camelCase, isArray, isDate, isFunction, isNil, isNumber, isObject, isRegExp, isString, snakeCase } from 'lodash-es'

/**
 * 将对象的snake属性转换为camle格式
 * @param source 源对象
 * @param target 目标对象，可选
 * @returns  转换后的对象
 *
 * @example
 * const obj = {
 *  'user_name': 'dinos',
 *  'user_age': 18,
 * }
 *
 * const res = toCamleObject(obj)
 * // res = {
 * //  userName: 'dinos',
 * //  userAge: 18,
 * // }
 */
export const toCamleObject = <T>(source: Object, target?: T): T => {
  if (isNil(source) || isString(source) || isNumber(source) || isRegExp(source) || isDate(source) || isFunction(source)) {
    return source as unknown as T
  }
  if (isArray(source)) {
    return source.map((v) => toCamleObject(v)) as unknown as T
  }
  const res = target ?? ({} as T)

  for (const prop in source) {
    const val = source[prop]
    if (prop.startsWith('@')) {
      res[prop] = toCamleObject(val)
    } else {
      res[camelCase(prop)] = toCamleObject(val)
    }
  }

  return res
}

/**
 * 将对象的camle属性转换为snake格式
 * @param source 源对象
 * @param target 目标对象，可选
 * @returns 转换后的对象
 *
 * @example
 * const obj = {
 *   userName: 'dinos',
 *   userAge: 18,
 * }
 *
 * const res = toSnakeObject(obj)
 * // res = {
 * //  'user_name': 'dinos',
 * //  'user_age': 18,
 * // }
 */
export const toSnakeObject = <T>(source: any, target?: T): T => {
  if (isNil(source) || isString(source) || isNumber(source) || isRegExp(source) || isDate(source) || isFunction(source)) {
    return source as unknown as T
  }
  if (isArray(source)) {
    return source.map((v) => toSnakeObject(v)) as unknown as T
  }
  const res = target ?? ({} as T)

  for (const prop in source) {
    const val = source[prop]
    if (prop.startsWith('@')) {
      res[prop] = toSnakeObject(val)
    } else {
      res[snakeCase(prop)] = toSnakeObject(val)
    }
  }

  return res
}

/**
 * 将'T | T[]' 这种类型统一处理成 T[]类型
 * @param v 待处理的值或数组
 * @returns T[]
 *
 * @example
 * const a = asArray('a')
 * // a = ['a']
 *
 * const b = asArray(['a', 'b'])
 * // b = ['a', 'b']
 */
export const asArray = <T>(v: T | T[]): T[] => {
  if (isNil(v)) {
    return []
  }
  if (isArray(v)) {
    return v
  }
  return [v]
}

/**
 * 同步获取值或函数调用结果
 * @param v 值，函数或Promise对象
 * @param restArgs 函数调用时的参数
 * @returns
 *
 * @example
 * const a = awaitGet('a')
 * // a = 'a'
 *
 * const b = awaitGet(() => 'b')
 * // b = 'b'
 *
 * const c = awaitGet(Promise.resolve('c'))
 * // c = 'c'
 *
 * const d = awaitGet(() => Promise.resolve('d'))
 * // d = 'd'
 *
 * const e = awaitGet((rest) => Promise.resolve(rest), 'e')
 * // e = 'e'
 */
export const awaitGet = <T>(v: T | ((...args: any[]) => Promise<T>) | ((...args: any[]) => T) | Promise<T>, ...restArgs: any[]): T => {
  if (isFunction(v)) {
    const fun = v as (...args: any[]) => Promise<T>
    v = fun(...restArgs)
  }
  if (isPromise(v)) {
    // 从Promise对象中获取值

    return Promise.all([v])[0]
  } else {
    return v
  }
}

/**
 * 是否是Promise对象
 * @param val 待判断的值
 * @returns 是否是Promise对象
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val['then']) && isFunction(val['catch'])
}

let id = 1

/**
 * 生成不断增长的id
 * @param prefix 前缀
 * @returns prefix + id
 *
 * @example
 * const a = useID()
 * // a = '1'
 *
 * const b = useID('dino-')
 * // b = 'dino-2'
 */
export const useID = (prefix?: string): string => {
  return (prefix ?? '') + ++id
}

// Copyright 2024 dinodev.cn.
// SPDX-License-Identifier: MIT

/**
 * 拦截器处理函数类型定义
 * @template ARG - 输入参数类型
 * @template CONTEXT - 上下文类型，默认为never
 */
export type InterceptorHandler<ARG, CONTEXT = never> = (arg: ARG, context: CONTEXT) => ARG | Promise<ARG>

/**
 * 拦截器管理器接口定义
 * @template ARG - 输入参数类型
 * @template CONTEXT - 上下文类型，默认为never
 */
export interface InterceptorManager<ARG, CONTEXT = never> {
  /**
   * 添加拦截器处理函数
   * @param handler - 拦截器处理函数
   * @returns 取消添加拦截器的函数
   */
  use(handler: InterceptorHandler<ARG, CONTEXT>): () => void

  /**
   * 清空所有拦截器处理函数
   */
  clear(): void

  /**
   * 获取所有拦截器处理函数
   * @returns 拦截器处理函数数组
   */
  getHandlers(): InterceptorHandler<ARG, CONTEXT>[]

  /**
   * 执行所有拦截器处理函数，按添加顺序执行
   * @param arg - 输入参数
   * @returns 返回值
   */
  execute(arg: ARG, context: CONTEXT): Promise<ARG>
}

interface InterceptorHandlerWithId<ARG, CONTEXT> extends InterceptorHandler<ARG, CONTEXT> {
  __id?: number
}

/**
 * 创建拦截器管理器的工厂函数
 * - 按添加顺序执行
 * - 如果`chain === true`，则将上一个拦截器的返回值作为下一个拦截器的输入参数
 * - 如果`chain === false`，则不会将上一个拦截器的返回值作为下一个拦截器的输入参数
 * @template ARG - 输入参数类型
 * @template CONTEXT - 上下文类型，默认为never
 * @param chain 是否链式执行, 默认为true
 * @returns
 */
export function defineInterceptorManager<ARG, CONTEXT = never>(chain: boolean = true): InterceptorManager<ARG, CONTEXT> {
  const handlers: InterceptorHandlerWithId<ARG, CONTEXT>[] = []
  let id = 0

  /**
   * 添加拦截器处理函数
   * @param handler - 拦截器处理函数
   * @returns 取消添加拦截器的函数
   */
  const use = (handler: InterceptorHandler<ARG, CONTEXT>): (() => void) => {
    const curId = ++id
    const handlerWithId: InterceptorHandlerWithId<ARG, CONTEXT> = handler
    handlerWithId.__id = curId
    handlers.push(handlerWithId)
    return () => {
      const index = handlers.findIndex((item) => item.__id === curId)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }

  /**
   * 清空所有拦截器处理函数
   */
  const clear = () => {
    handlers.splice(0, handlers.length)
  }

  /**
   * 获取所有拦截器处理函数
   * @returns 拦截器处理函数数组
   */
  const getHandlers = () => {
    return handlers
  }

  /**
   * 执行所有拦截器处理函数，按添加顺序执行
   * @param arg - 输入参数
   * @param context - 上下文
   * @returns 返回值
   */
  const execute = async (arg: ARG, context: CONTEXT): Promise<ARG> => {
    let result = arg

    for (const handler of handlers) {
      result = await handler(arg, context)
      if (chain) {
        arg = result
      }
    }

    return result
  }

  return {
    use,
    clear,
    execute,
    getHandlers
  }
}

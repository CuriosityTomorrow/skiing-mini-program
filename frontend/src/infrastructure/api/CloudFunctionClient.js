/**
 * 微信云函数客户端
 *
 * 封装云函数调用，处理通用逻辑
 * 支持 Mock 模式用于本地开发
 */

import { appConfig } from '../config/index'
import { mockCloudFunction } from '../mock/resortMockData'

export class CloudFunctionClient {
  /**
   * 调用云函数
   * 如果开启 Mock 模式，则返回本地模拟数据
   */
  async callFunction(name, data) {
    // Mock 模式：返回本地模拟数据
    if (appConfig.useMock) {
      console.log(`[Mock模式] 调用云函数: ${name}`, data)

      // 模拟网络延迟
      await this.delay(300)

      // 返回 Mock 数据
      return mockCloudFunction[name] ? mockCloudFunction[name](data) : {
        code: -1,
        message: `Mock 数据未实现: ${name}`,
        data: null,
      }
    }

    // 真实模式：调用微信云函数
    try {
      // @ts-ignore - wx.cloud 在uni-app环境中由HBuilderX注入
      const result = await wx.cloud.callFunction({
        name,
        data,
      })

      return result.result
    } catch (error) {
      console.error(`[云函数调用失败] ${name}:`, error)
      return {
        code: -1,
        message: error.message || '云函数调用失败',
        error: error.errMsg,
      }
    }
  }

  /**
   * 调用云函数（自动检查错误）
   */
  async callFunctionWithCheck(name, data) {
    const result = await this.callFunction(name, data)

    if (result.code !== 0) {
      throw new Error(result.message || '云函数调用失败')
    }

    if (result.data === undefined) {
      throw new Error('云函数返回数据为空')
    }

    return result.data
  }

  /**
   * 模拟网络延迟
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 导出单例
export const cloudFunctionClient = new CloudFunctionClient()

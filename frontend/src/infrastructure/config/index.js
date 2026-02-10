/**
 * 应用配置
 */

export const appConfig = {
  // 是否使用 Mock 数据（开发阶段可用，等云开发可用后改为 false）
  useMock: true,

  // 云开发环境配置
  cloud: {
    env: 'cloudbase-0g4g10cr89711adb', // 环境ID
    traceUser: true, // 是否跟踪用户
  },
}

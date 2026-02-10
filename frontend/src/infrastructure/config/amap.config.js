/**
 * 高德地图配置
 *
 * 获取API Key步骤：
 * 1. 访问 https://lbs.amap.com/
 * 2. 注册并登录
 * 3. 进入"控制台" → "应用管理" → "我的应用"
 * 4. 创建应用，添加Key，选择"微信小程序"平台
 * 5. 将生成的Key填入下方
 */

export const AMAP_CONFIG = {
  // 替换为你的高德API Key
  apiKey: 'YOUR_AMAP_API_KEY_HERE',

  // 高德Web服务API域名
  webServiceDomain: 'https://restapi.amap.com'
}

// 注意：
// 1. 获取Key后，需要在微信小程序后台配置服务器域名
// 2. 域名：restapi.amap.com
// 3. 路径：小程序后台 → 开发 → 开发管理 → 开发设置 → 服务器域名

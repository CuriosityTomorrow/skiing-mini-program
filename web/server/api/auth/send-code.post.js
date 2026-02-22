import { useDb } from '../../utils/db'
import { authCodes } from '../../utils/schema'

export default defineEventHandler(async (event) => {
  const { phone } = await readBody(event)
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    throw createError({ statusCode: 400, message: '手机号格式不正确' })
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5分钟

  const db = useDb()
  db.insert(authCodes).values({ phone, code, expiresAt }).run()

  // 生产环境接入短信服务商，开发环境直接返回验证码
  console.log(`[AUTH] 验证码 ${phone}: ${code}`)

  return { code: 0, message: '验证码已发送', ...(process.dev ? { _dev_code: code } : {}) }
})

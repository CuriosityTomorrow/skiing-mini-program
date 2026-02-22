import { useDb } from '../../utils/db'
import { users } from '../../utils/schema'
import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization')
  if (!auth?.startsWith('Bearer ')) throw createError({ statusCode: 401, message: '未登录' })

  const config = useRuntimeConfig()
  const secret = new TextEncoder().encode(config.jwtSecret)
  const { payload } = await jwtVerify(auth.slice(7), secret).catch(() => {
    throw createError({ statusCode: 401, message: 'token 无效' })
  })

  const db = useDb()
  const user = db.select().from(users).where(eq(users.id, Number(payload.sub))).get()
  if (!user) throw createError({ statusCode: 404, message: '用户不存在' })

  return { code: 0, user: { id: user.id, phone: user.phone, nickname: user.nickname, avatarUrl: user.avatarUrl, role: user.role } }
})

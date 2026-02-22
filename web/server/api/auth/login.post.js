import { useDb } from '../../utils/db'
import { users, authCodes } from '../../utils/schema'
import { eq, and, gt } from 'drizzle-orm'
import { SignJWT } from 'jose'

export default defineEventHandler(async (event) => {
  const { phone, code } = await readBody(event)
  const db = useDb()

  // 验证验证码
  const record = db.select().from(authCodes)
    .where(and(
      eq(authCodes.phone, phone),
      eq(authCodes.code, code),
      eq(authCodes.used, false),
      gt(authCodes.expiresAt, new Date()),
    ))
    .get()

  if (!record) throw createError({ statusCode: 400, message: '验证码错误或已过期' })

  // 标记已使用
  db.update(authCodes).set({ used: true }).where(eq(authCodes.id, record.id)).run()

  // 查找或创建用户
  let user = db.select().from(users).where(eq(users.phone, phone)).get()
  const now = new Date()
  if (!user) {
    const result = db.insert(users).values({
      phone,
      nickname: '雪友' + phone.slice(-4),
      role: 'user',
      createdAt: now,
      updatedAt: now,
    }).run()
    user = db.select().from(users).where(eq(users.phone, phone)).get()
  }

  // 签发 JWT
  const config = useRuntimeConfig()
  const secret = new TextEncoder().encode(config.jwtSecret)
  const token = await new SignJWT({ sub: String(user.id), role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret)

  return { code: 0, token, user: { id: user.id, phone: user.phone, nickname: user.nickname, avatarUrl: user.avatarUrl, role: user.role } }
})

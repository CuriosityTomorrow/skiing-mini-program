import { useDb } from '../../utils/db'
import { favorites } from '../../utils/schema'
import { eq, and } from 'drizzle-orm'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization')
  if (!auth?.startsWith('Bearer ')) throw createError({ statusCode: 401, message: '未登录' })

  const config = useRuntimeConfig()
  const secret = new TextEncoder().encode(config.jwtSecret)
  const { payload } = await jwtVerify(auth.slice(7), secret).catch(() => {
    throw createError({ statusCode: 401, message: 'token 无效' })
  })

  const { resortId } = await readBody(event)
  if (!resortId) throw createError({ statusCode: 400, message: '缺少 resortId' })

  const db = useDb()
  const userId = Number(payload.sub)
  const existing = db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.resortId, resortId))).get()

  if (existing) {
    db.delete(favorites).where(eq(favorites.id, existing.id)).run()
    return { code: 0, favorited: false }
  } else {
    db.insert(favorites).values({ userId, resortId, createdAt: new Date() }).run()
    return { code: 0, favorited: true }
  }
})

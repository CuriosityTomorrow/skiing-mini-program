import { useDb } from '../../utils/db'
import { users } from '../../utils/schema'
import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization')
  if (!auth?.startsWith('Bearer ')) throw createError({ statusCode: 401 })

  const config = useRuntimeConfig()
  const secret = new TextEncoder().encode(config.jwtSecret)
  const { payload } = await jwtVerify(auth.slice(7), secret).catch(() => { throw createError({ statusCode: 401 }) })

  const { nickname } = await readBody(event)
  if (!nickname?.trim()) throw createError({ statusCode: 400, message: '昵称不能为空' })

  const db = useDb()
  db.update(users).set({ nickname: nickname.trim() }).where(eq(users.id, Number(payload.sub))).run()

  return { code: 0 }
})

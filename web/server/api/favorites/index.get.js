import { useDb } from '../../utils/db'
import { favorites } from '../../utils/schema'
import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization')
  if (!auth?.startsWith('Bearer ')) return { code: 0, data: [] }

  const config = useRuntimeConfig()
  const secret = new TextEncoder().encode(config.jwtSecret)
  const { payload } = await jwtVerify(auth.slice(7), secret).catch(() => null) || {}
  if (!payload) return { code: 0, data: [] }

  const db = useDb()
  const rows = db.select().from(favorites).where(eq(favorites.userId, Number(payload.sub))).all()
  return { code: 0, data: rows.map(r => r.resortId) }
})

import { useDb } from '../../utils/db'
import { favorites, resorts } from '../../utils/schema'
import { eq, inArray } from 'drizzle-orm'
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
  if (!rows.length) return { code: 0, data: [] }

  const ids = rows.map(r => r.resortId)
  const data = db.select().from(resorts).where(inArray(resorts.id, ids)).all()
  return { code: 0, data: data.map(r => ({
    ...r,
    images: Array.isArray(r.images) ? r.images : (r.images ? (() => { try { return JSON.parse(r.images) } catch { return [] } })() : []),
  })) }
})

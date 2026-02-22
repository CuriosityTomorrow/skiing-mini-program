import { useDb } from '../../../utils/db'
import { users } from '../../../utils/schema'
import { like, or, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { keyword = '', limit = 20, offset = 0 } = getQuery(event)
  const db = useDb()

  let query = db.select({
    id: users.id, phone: users.phone, nickname: users.nickname,
    avatarUrl: users.avatarUrl, role: users.role, createdAt: users.createdAt
  }).from(users)

  if (keyword) {
    query = query.where(or(like(users.phone, `%${keyword}%`), like(users.nickname, `%${keyword}%`)))
  }

  const all = await query.orderBy(desc(users.id)).all()
  const total = all.length
  const data = all.slice(Number(offset), Number(offset) + Number(limit))
  return { code: 0, data, total }
})

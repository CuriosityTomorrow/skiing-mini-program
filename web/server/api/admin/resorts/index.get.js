import { useDb } from '../../../utils/db'
import { resorts } from '../../../utils/schema'
import { like, or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { keyword, limit = 20, offset = 0 } = getQuery(event)
  const db = useDb()

  let rows
  if (keyword) {
    rows = db.select().from(resorts).where(or(
      like(resorts.name, `%${keyword}%`),
      like(resorts.province, `%${keyword}%`),
      like(resorts.city, `%${keyword}%`),
    )).limit(Number(limit)).offset(Number(offset)).all()
  } else {
    rows = db.select().from(resorts).limit(Number(limit)).offset(Number(offset)).all()
  }

  const total = db.select().from(resorts).all().length
  return { code: 0, data: rows, total }
})

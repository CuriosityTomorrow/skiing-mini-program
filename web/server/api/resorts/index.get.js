import { eq, desc, asc, and, sql } from 'drizzle-orm'
import { resorts } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const {
    keyword = '',
    type = '',
    province = '',
    sortBy = 'popularity',
    limit = 50,
    offset = 0,
  } = query

  try {
    const db = useDb()

    // Build conditions array
    const conditions = []

    if (keyword) {
      // Search in name, city, province, district
      conditions.push(
        sql`(${resorts.name} LIKE ${'%' + keyword + '%'} OR ${resorts.city} LIKE ${'%' + keyword + '%'} OR ${resorts.province} LIKE ${'%' + keyword + '%'} OR ${resorts.district} LIKE ${'%' + keyword + '%'})`
      )
    }

    if (type && type !== 'all') {
      conditions.push(eq(resorts.type, type))
    }

    if (province) {
      conditions.push(eq(resorts.province, province))
    }

    // Build query
    let dbQuery = db.select().from(resorts)

    if (conditions.length > 0) {
      dbQuery = dbQuery.where(and(...conditions))
    }

    // Sorting
    const sortMap = {
      popularity: desc(resorts.popularity),
      rating: desc(resorts.rating),
      price_low: asc(sql`json_extract(${resorts.pricing}, '$.weekdayDaily')`),
      price_high: desc(sql`json_extract(${resorts.pricing}, '$.weekdayDaily')`),
      trail_count: desc(sql`json_extract(${resorts.trails}, '$.total')`),
    }

    const orderBy = sortMap[sortBy] || desc(resorts.popularity)
    dbQuery = dbQuery.orderBy(orderBy)

    // Pagination
    dbQuery = dbQuery.limit(Number(limit)).offset(Number(offset))

    const results = dbQuery.all()

    // Get total count (for pagination)
    let countQuery = db.select({ count: sql`count(*)` }).from(resorts)
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions))
    }
    const [{ count: total }] = countQuery.all()

    return {
      code: 0,
      message: 'success',
      data: results,
      total,
    }
  } catch (error) {
    console.error('[API] /api/resorts error:', error)
    return {
      code: -1,
      message: error.message,
      data: [],
      total: 0,
    }
  }
})

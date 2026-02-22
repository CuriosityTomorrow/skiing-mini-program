import { eq } from 'drizzle-orm'
import { resorts } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: '无效的滑雪场 ID',
    })
  }

  try {
    const db = useDb()
    const [resort] = db.select().from(resorts).where(eq(resorts.id, id)).limit(1).all()

    if (!resort) {
      throw createError({
        statusCode: 404,
        message: '滑雪场不存在',
      })
    }

    return {
      code: 0,
      message: 'success',
      data: resort,
    }
  } catch (error) {
    if (error.statusCode) throw error

    console.error('[API] /api/resorts/:id error:', error)
    return {
      code: -1,
      message: error.message,
      data: null,
    }
  }
})

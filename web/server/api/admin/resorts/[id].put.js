import { useDb } from '../../../utils/db'
import { resorts } from '../../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const db = useDb()

  db.update(resorts).set({ ...body, updatedAt: new Date() }).where(eq(resorts.id, id)).run()
  return { code: 0 }
})

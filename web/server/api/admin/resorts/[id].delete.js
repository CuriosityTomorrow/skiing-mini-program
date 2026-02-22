import { useDb } from '../../../utils/db'
import { resorts } from '../../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()
  db.delete(resorts).where(eq(resorts.id, id)).run()
  return { code: 0 }
})

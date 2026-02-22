import { useDb } from '../../../utils/db'
import { users } from '../../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()
  db.delete(users).where(eq(users.id, id)).run()
  return { code: 0 }
})

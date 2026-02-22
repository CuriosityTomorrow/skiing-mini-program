import { useDb } from '../../../utils/db'
import { resorts } from '../../../utils/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = useDb()

  const now = new Date()
  const result = db.insert(resorts).values({
    ...body,
    createdAt: now,
    updatedAt: now,
  }).run()

  return { code: 0, data: { id: result.lastInsertRowid } }
})

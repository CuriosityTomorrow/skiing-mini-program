import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.js'
import { resolve } from 'path'

let _db = null

export function useDb() {
  if (!_db) {
    const dbPath = resolve(process.cwd(), 'db/skiing.db')
    const sqlite = new Database(dbPath)
    sqlite.pragma('journal_mode = WAL')
    _db = drizzle(sqlite, { schema })
  }
  return _db
}

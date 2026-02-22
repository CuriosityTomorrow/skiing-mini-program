import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  phone: text('phone').unique(),
  wechatOpenid: text('wechat_openid').unique(),
  nickname: text('nickname'),
  avatarUrl: text('avatar_url'),
  role: text('role').default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const authCodes = sqliteTable('auth_codes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  phone: text('phone').notNull(),
  code: text('code').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  used: integer('used', { mode: 'boolean' }).default(false),
})


export const resorts = sqliteTable('resorts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  province: text('province').notNull(),
  city: text('city').notNull(),
  district: text('district'),
  address: text('address'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  type: text('type').notNull(),
  popularity: integer('popularity').default(0),
  rating: real('rating').default(0),
  facilities: text('facilities', { mode: 'json' }),
  trails: text('trails', { mode: 'json' }),
  pricing: text('pricing', { mode: 'json' }),
  season: text('season', { mode: 'json' }),
  contact: text('contact', { mode: 'json' }),
  community: text('community', { mode: 'json' }),
  scores: text('scores', { mode: 'json' }),
  suitableFor: text('suitable_for', { mode: 'json' }),
  highlights: text('highlights', { mode: 'json' }),
  tags: text('tags', { mode: 'json' }),
  images: text('images', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

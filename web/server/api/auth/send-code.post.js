import { useDb } from '../../utils/db'
import { authCodes } from '../../utils/schema'
import crypto from 'crypto'

function sign(params, secret) {
  const sorted = Object.keys(params).sort().map(k =>
    `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
  ).join('&')
  const str = `GET&${encodeURIComponent('/')}&${encodeURIComponent(sorted)}`
  return crypto.createHmac('sha1', secret + '&').update(str).digest('base64')
}

async function sendSms(phone, code, config) {
  const params = {
    Action: 'SendSmsVerifyCode',
    Version: '2017-05-25',
    Format: 'JSON',
    AccessKeyId: config.aliyunAccessKeyId,
    SignatureMethod: 'HMAC-SHA1',
    SignatureVersion: '1.0',
    SignatureNonce: Math.random().toString(36).slice(2),
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    PhoneNumber: phone,
    SignName: '速通互联验证码',
    TemplateCode: '100001',
    TemplateParam: JSON.stringify({ code, min: '5' }),
  }
  params.Signature = sign(params, config.aliyunAccessKeySecret)
  const url = 'https://dypnsapi.aliyuncs.com/?' + Object.keys(params).map(k =>
    `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
  ).join('&')
  const res = await fetch(url).then(r => r.json())
  if (res.Code !== 'OK') throw new Error(res.Message || res.Code)
}

export default defineEventHandler(async (event) => {
  const { phone } = await readBody(event)
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    throw createError({ statusCode: 400, message: '手机号格式不正确' })
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  const db = useDb()
  db.insert(authCodes).values({ phone, code, expiresAt }).run()

  const config = useRuntimeConfig()
  if (config.aliyunAccessKeyId) {
    await sendSms(phone, code, config)
  } else {
    console.log(`[AUTH] 验证码 ${phone}: ${code}`)
  }

  return { code: 0, message: '验证码已发送' }
})

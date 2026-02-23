<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="text-4xl mb-3">⛷️</div>
        <h1 class="text-2xl font-bold text-gray-900">登录去滑雪吧</h1>
        <p class="text-gray-500 text-sm mt-1">手机号验证码登录</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
          <input
            v-model="phone"
            type="tel"
            placeholder="请输入手机号"
            maxlength="11"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nomad-300"
          />
        </div>

        <!-- Code -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
          <div class="flex gap-2">
            <input
              v-model="code"
              type="text"
              placeholder="6位验证码"
              maxlength="6"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nomad-300"
            />
            <button
              :disabled="countdown > 0 || sending"
              class="px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
              :class="countdown > 0 ? 'bg-gray-100 text-gray-400' : 'bg-nomad-gradient text-white hover:opacity-90'"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
          <!-- Dev hint -->
          <p v-if="devCode" class="text-xs text-orange-500 mt-1">开发模式验证码：{{ devCode }}</p>
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          :disabled="loading"
          class="w-full py-3 bg-nomad-gradient text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          @click="login"
        >
          {{ loading ? '登录中...' : '登录 / 注册' }}
        </button>
      </div>

      <p class="text-center text-xs text-gray-400 mt-4">登录即代表同意用户协议和隐私政策</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const phone = ref('')
const code = ref('')
const devCode = ref('')
const countdown = ref(0)
const sending = ref(false)
const loading = ref(false)
const error = ref('')

const route = useRoute()

async function sendCode() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    error.value = '请输入正确的手机号'
    return
  }
  error.value = ''
  sending.value = true
  try {
    const res = await $fetch('/api/auth/send-code', { method: 'POST', body: { phone: phone.value } })
    devCode.value = res._dev_code || ''
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (e) {
    error.value = e.data?.message || '发送失败'
  }
  sending.value = false
}

async function login() {
  if (!phone.value || !code.value) {
    error.value = '请填写手机号和验证码'
    return
  }
  error.value = ''
  loading.value = true
  try {
    const res = await $fetch('/api/auth/login', { method: 'POST', body: { phone: phone.value, code: code.value } })
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    navigateTo(route.query.redirect || '/')
  } catch (e) {
    error.value = e.data?.message || '登录失败'
  }
  loading.value = false
}
</script>

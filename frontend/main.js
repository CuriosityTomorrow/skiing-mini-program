import { createSSRApp } from 'vue'
import App from './src/App.vue'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}

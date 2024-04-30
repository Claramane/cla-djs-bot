import { createApp } from 'vue'
import { createPinia } from 'pinia'


export default () => {
    console.log('Vue Init...')
    const vue = createApp({})
    const pinia = createPinia()
    vue.use(pinia)
}
import router from "../router"
import { defineStore } from "pinia"
import { computed, reactive, ref } from "vue"
import axios from '../service/axios'

export const useAuthStore = defineStore('auth', () => {

  const tokenFromLocalStorage = localStorage.getItem('token') || ''

  const token = ref(tokenFromLocalStorage)

  const isAuth = computed(() => token.value !== '')

  const userFromLocalStorage = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  })()
  const user = reactive<any>(userFromLocalStorage)
  
  const login = async (form: any) => {
    try {
      const res = await axios.post('auth/login', form)

      console.log("FULL RESPONSE:", res)
      console.log("DATA:", res.data)
      console.log("INNER DATA:", res.data.data)

      // 🔥 ຈຸດສຳຄັນ
      const tokenData = res.data?.data?.access_token
      const userData = res.data?.data?.user

      if (!userData) {
        console.error("❌ user ບໍ່ມີ:", res.data)
        return
      }

      token.value = tokenData
      localStorage.setItem('token', token.value)
      localStorage.setItem('role', userData.role)
      localStorage.setItem('user', JSON.stringify(userData))

      Object.assign(user, userData)

      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      if (userData.role === 'ADMIN') {
        router.push({ path: '/' })
      } else {
        router.push({ path: '/login' })
        console.log("So sorry, you can't")
      }

    } catch (error) {
      console.error('Login failed:', error)
    }

  }




  const logOut = async () => {
    localStorage.clear()
    setTimeout(() => {
      router.push({ path: '/login' })
      window.location.reload()
    }, 200)
  }
  return {
    token,
    isAuth,
    user,
    login,
    logOut
  }


})



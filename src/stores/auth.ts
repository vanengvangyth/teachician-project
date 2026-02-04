import router from "../router"
import { defineStore } from "pinia"
import { computed, reactive, ref } from "vue"
import axios from '../service/axios'

export const useAuthStore = defineStore('auth', () => {

    const tokenFromLocalStorage = localStorage.getItem('token') || ''

    const user = reactive<any>({})

    const token = ref(tokenFromLocalStorage)

    const isAuth = computed(() => token.value !== '')

    const login = async (form: any) => {
    try {
        const res = await axios.post('auth/login', form)

        const tokenData = res.data.access_token
        const userData = res.data.user

        token.value = tokenData
        localStorage.setItem('token', token.value)
        localStorage.setItem('role', userData.role)

        // save user into store state
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



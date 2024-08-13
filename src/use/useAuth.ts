import { computed } from 'vue'
import { ILoginInfo } from '../types'
import { useUserStore } from '../stores/user'
import { auth } from '../api/user'

export function useAuth() {
	const store = useUserStore()
	const user = computed(() => store.getUserInfo)
	const login = async (data: ILoginInfo) => {
		const { token, userInfo } = await auth(data)
		store.setInfo({ token, userInfo })
	}
	const logout = () => {
		store.removeInfo()
	}
	return {
		user: {},
		login,
		logout
	}
}

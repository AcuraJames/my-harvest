import { getStorage, getTokenByName, removeFromStorage, setStorage, setTriggerAuth, sleep } from '@/utils/common'
import { loginByEmailAndPassword, reAuth, endSession } from '@/api/auth'

export const authModule = {
  state: {
    tokens: null,
    isAuth: false
  },
  mutations: {
    setTokens(state, tokens) {
      state.tokens = tokens
    }
  },
  actions: {
    async getToken({ commit, dispatch }) {
      const accToken = getTokenByName('accessToken')
      const refToken = getTokenByName('refreshToken')

      if (accToken) {
        return accToken
      }

      if (refToken === null) {
        commit('setTokens', null)
        window.location.href = '/auth'
        removeFromStorage('tokens')
        return null
      }

      const triggerAuth = JSON.parse(getStorage('triggerAuthDate'))
      if (triggerAuth) {
        if (parseInt(triggerAuth, 10) > Date.now()) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const accessToken = getTokenByName('accessToken')
            if (accessToken !== null) {
              return accessToken
            }
            await sleep(500)
          }
        }
      }

      setTriggerAuth(Date.now() + 100000)
      return await dispatch('reAuth')
    },

    async login({ commit }, payload) {
      const res = await loginByEmailAndPassword(payload.email, payload.password)
      if (res?.success) {
        await commit('setTokens', res.data)
        setStorage('tokens', JSON.stringify(res.data))
      }
      return res
    },

    async reAuth({ commit }) {
      const refToken = getTokenByName('refreshToken')

      const res = await reAuth(refToken)

      if (!res.success) {
        if (res.status === 409) {
          commit('setTokens', null)
          window.location.href = '/auth'
          removeFromStorage('tokens')
        }
        return
      }
      commit('setTokens', res.data)
      setStorage('tokens', JSON.stringify(res.data))
      return res.data.accessToken
    },
    async logout({ dispatch, commit }) {
      const token = await dispatch('getToken')
      commit('setTokens', null)
      if (!token) return
      try {
        return await endSession(token)
      } catch (err) {
        return err
      }
    }
  },
  getters: {
    isLogin: (state) => !!state.tokens
  }
}

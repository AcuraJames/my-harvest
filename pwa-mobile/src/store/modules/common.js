import {
  getProfile,
  getContainers,
  getContainerLastWeight,
  getCultures,
  getFields,
  createContainer,
  getWarehouses,
  getMessages,
  updateMessageStatus
} from '@/api/common'

export const commonModule = {
  state: {
    user: null,
    success: {
      success: false,
      message: ''
    },
    error: ''
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    sendSuccess(state, payload) {
      state.success = payload
    },
    sendError(state, payload) {
      state.error = payload
    }
  },
  actions: {
    async getUser({ commit, dispatch }) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        const res = await getProfile(token)
        commit('setUser', res)
        return res
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getContainers({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getContainers(token, data)
      } catch (err) {
        return err
      }
    },
    async getContainerLastWeight({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getContainerLastWeight(token, data)
      } catch (err) {
        return err
      }
    },
    async getCultures({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getCultures(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getFields({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getFields(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async createContainer({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await createContainer(token, data)
      } catch (e) {
        return e
      }
    },
    async getWarehouses({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getWarehouses(token, data)
      } catch (e) {
        return e
      }
    },
    async getMessages({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getMessages(token, data)
      } catch (e) {
        return e
      }
    },
    async updateMessageStatus({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await updateMessageStatus(token, data)
      } catch (e) {
        return e
      }
    }
  },
  getters: {
    isSuccess: ({ success }) => success,
    isError: ({ error }) => error
  }
}

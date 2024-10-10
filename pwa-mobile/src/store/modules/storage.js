import { getUrlImg } from '@/api/storage'

export const storageModule = {
  state: {},
  mutations: {},
  actions: {
    async uploadImage({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getUrlImg(token, data)
      } catch (err) {
        return err
      }
    }
  }
}

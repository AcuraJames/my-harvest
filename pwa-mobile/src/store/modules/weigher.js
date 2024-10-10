import { getHarvestsTemplate, createHarvest, getStatistics, getHarvestsHistory, getHarvestHistory } from '@/api/weigher'

export const weigherModule = {
  actions: {
    async getWeigherHarvestsTemplate({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getHarvestsTemplate(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async createWeigherHarvest({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await createHarvest(token, data)
      } catch (e) {
        return e
      }
    },
    async getWeigherStatistics({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getStatistics(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getWeigherHarvestsHistory({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getHarvestsHistory(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getWeigherHarvestHistory({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getHarvestHistory(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    }
  }
}

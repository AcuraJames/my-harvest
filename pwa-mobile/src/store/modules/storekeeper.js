import {
  getHarvests,
  createHarvest,
  getHarvestsTemplate,
  getStatistics,
  getHarvestsHistory,
  getHarvestHistory
} from '@/api/storekeeper'

export const storekeeperModule = {
  actions: {
    async getHarvests({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getHarvests(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async createStorekeeperHarvest({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await createHarvest(token, data)
      } catch (e) {
        return e
      }
    },
    async getStorekeeperHarvestsTemplate({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getHarvestsTemplate(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getStorekeeperStatistics({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getStatistics(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getStorekeeperHarvestsHistory({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getHarvestsHistory(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getStorekeeperHarvestHistory({ dispatch }, data) {
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

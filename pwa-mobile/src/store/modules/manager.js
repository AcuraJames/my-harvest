import {
  getCulturesStatistics,
  getCultureBySpecificationStatistics,
  getCultureByFieldsStatistics,
  getFieldsStatistics,
  getFieldsStatisticsByArea,
  getWarehousesStatistics,
  getWarehouseBySpecificationStatistics,
  createHarvestedArea,
  getHarvestStatisticsByDays,
  sendMessage
} from '@/api/manager'

export const managerModule = {
  actions: {
    async getCulturesStatistics({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getCulturesStatistics(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getCultureByFieldsStatistics({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getCultureByFieldsStatistics(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getFieldsStatistics({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getFieldsStatistics(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getFieldsStatisticsByArea({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getFieldsStatisticsByArea(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getWarehousesStatistics({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getWarehousesStatistics(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getWarehouseBySpecificationStatistics({ dispatch }, data) {
      console.log(data)
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getWarehouseBySpecificationStatistics(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async getCultureBySpecification({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getCultureBySpecificationStatistics(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async createHarvestedArea({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await createHarvestedArea(token, data)
      } catch (e) {
        return e
      }
    },
    async getHarvestStatisticsByDays({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await getHarvestStatisticsByDays(token, data)
      } catch (err) {
        console.log(err)
        return err
      }
    },
    async sendMessage({ dispatch }, data) {
      const token = await dispatch('getToken')
      if (!token) return
      try {
        return await sendMessage(token, data)
      } catch (err) {
        return err
      }
    }
  }
}

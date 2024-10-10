import { apiRequest } from '@/api/index'
// import { errorsTranslate } from '@/constants/errorsTranslate'
import { currentSettings } from '@/settings'
import { errorsTranslate } from '@/constants/errorsTranslate'

const URL = currentSettings.api.URL_API_WS

export const getCulturesStatistics = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/manager/cultures/statistics`, 'POST', data, token)
  const { stats } = await response.json()
  return stats
}

export const getCultureBySpecificationStatistics = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/manager/cultures/statistics/specifications`, 'POST', data, token)
  return await response.json()
}

export const getCultureByFieldsStatistics = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/manager/cultures/statistics/fields`, 'POST', data, token)
  return await response.json()
}

export const getFieldsStatistics = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/manager/fields/statistics`, 'POST', data, token)
  const { stats } = await response.json()
  return stats
}

export const getFieldsStatisticsByArea = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/manager/fields/statistics/area`, 'POST', data, token)
  const { stats } = await response.json()
  return stats
}

export const getWarehousesStatistics = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/manager/warehouses/statistics`, 'POST', data, token)
  const { warehousesStats } = await response.json()
  return warehousesStats
}

export const getWarehouseBySpecificationStatistics = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/manager/warehouses/statistics/specifications`, 'POST', data, token)
  return await response.json()
}

export const createHarvestedArea = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/manager/fields/id/area`, 'PUT', data, token)

  if (!response.ok) {
    const errorMsg = (await response.text()).replace('\n', '')
    return { message: errorsTranslate[errorMsg] }
  }
  return { success: true }
}

export const getHarvestStatisticsByDays = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/harvest/statistics/days`, 'POST', data, token)

  const { statistics } = await response.json()
  return statistics
}

export const sendMessage = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/manager/notifications/id`, 'PUT', data, token)
  return await response.json()
}

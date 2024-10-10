import { apiRequest } from '@/api/index'
import { errorsTranslate } from '@/constants/errorsTranslate'
import { currentSettings } from '@/settings'

const URL = currentSettings.api.URL_API_WS

export const getHarvests = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/storekeeper/harvests/templates/id`, 'POST', data, token)

  return await response.json()
}

export const createHarvest = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/storekeeper/harvests/id`, 'PUT', data, token)

  if (!response.ok) {
    const errorMsg = (await response.text()).replace('\n', '')
    return { message: errorsTranslate[errorMsg] }
  }
  return { success: true }
}

export const getHarvestsTemplate = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/storekeeper/harvests/templates/id`, 'POST', data, token)

  return await response.json()
}

export const getStatistics = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/storekeeper/statistics`, 'POST', data, token)

  return await response.json()
}

export const getHarvestsHistory = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/storekeeper/harvests`, 'POST', data, token)

  return await response.json()
}

export const getHarvestHistory = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/storekeeper/harvests/id`, 'POST', data, token)

  const { harvest } = await response.json()
  return harvest
}

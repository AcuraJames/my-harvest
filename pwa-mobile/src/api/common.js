import { apiRequest } from '@/api/index'
import { errorsTranslate } from '@/constants/errorsTranslate'
import { currentSettings } from '@/settings'

const URL = currentSettings.api.URL_API_WS

export const getProfile = async (token) => {
  const response = await apiRequest(`${URL}/v1/p/users/id`, 'POST', null, token)

  // Work in process...
  if (!response.ok) {
    throw new Error(`Error ${response.status}`)
  }
  const { user } = await response.json()

  return user
}

export const getContainers = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/containers`, 'POST', data, token)

  const { containers } = await response.json()
  return containers
}

export const getContainerLastWeight = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/containers/id/lastWeight`, 'POST', data, token)

  if (!response.ok) return { success: false }

  const { weightKg } = await response.json()
  return { success: true, data: weightKg }
}

export const getCultures = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/cultures`, 'POST', data, token)

  return await response.json()
}

export const getFields = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/fields`, 'POST', data, token)

  return await response.json()
}

export const createContainer = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/containers/id`, 'PUT', data, token)

  if (!response.ok) {
    const errorMsg = (await response.text()).replace('\n', '')
    return { message: errorsTranslate[errorMsg] }
  }
  return { success: true }
}

export const getWarehouses = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/warehouses`, 'POST', data, token)

  return await response.json()
}
export const getMessages = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/notifications`, 'POST', data, token)

  return await response.json()
}

export const updateMessageStatus = async (token, data) => {
  const response = await apiRequest(`${URL}/v1/p/notifications/id`, 'PATCH', data, token)

  return await response.json()
}

import { getDeviceData, setStorage, setTriggerAuth, addSessionId } from '@/utils/common'
import { apiRequest } from '@/api/index'
import { currentSettings } from '@/settings'

const USER_APP_VERSION = 'PWA-v0.0.1'
const URL = currentSettings.api.URL_API_AUTH

export const loginByEmailAndPassword = async (email, password) => {
  const device = getDeviceData()
  const response = await apiRequest(`${URL}/v1/user/session/email/password`, 'PUT', {
    email,
    password,
    device,
    projectID: 200,
    userAppVersion: USER_APP_VERSION
  })

  if (!response.ok) {
    let message = ''
    if (response.status === 400) {
      message = 'Введите корректный E-mail'
    }
    if (response.status === 409) {
      message = 'Пользователь не найден'
    }
    return { success: false, message }
  }
  const result = await response.json()
  setStorage('session-id', JSON.stringify(result.sessionId))
  return { success: true, data: result }
}

export const reAuth = async (refreshToken) => {
  let controller = await new AbortController()
  const response = await apiRequest(
    `${URL}/v1/user/session/token/access`,
    'PUT',
    { refreshToken },
    null,
    { signal: controller.signal },
    { ...addSessionId() }
  ).catch(async function (err) {
    if (err.name === 'AbortError') {
      console.log('Timeout Error')
      setTriggerAuth(Date.now())
      return
    }
    console.log('Connection Error', err)
    setTriggerAuth(Date.now())
  })

  const result = await response.json()

  if (response.ok) {
    setStorage('tokens', JSON.stringify(result))
    return { success: true, data: result }
  } else {
    return { success: false, status: response.status }
  }
}

export const endSession = async (token) => {
  const response = await apiRequest(`${URL}/v1/private/user/session/token/refresh`, 'DELETE', null, token)

  return await response.json()
}

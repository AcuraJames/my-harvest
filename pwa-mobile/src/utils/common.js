import { roles } from '@/constants/roles'

export const getStorage = (name) => localStorage.getItem(name)
export const setStorage = (name, value) => localStorage.setItem(name, value)
export const removeFromStorage = (name) => localStorage.removeItem(name)

export const getDeviceData = () => {
  const time = new Date()
  const currentTimeZoneOffsetInHours = (time.getTimezoneOffset() / 60).toString()
  const platform = navigator?.userAgentData?.platform || navigator?.platform || 'unknown'

  return {
    height: window.innerHeight,
    language: navigator.language,
    platform: platform,
    timezone: currentTimeZoneOffsetInHours,
    width: window.innerWidth
  }
}

export const getTokenByName = (name) => {
  const tokens = JSON.parse(getStorage('tokens'))
  if (tokens === null) return null
  console.log('token: имя', name)
  const currentDate = Date.now()
  console.log('token: пачка всех токенов', tokens)
  const decodeAccess = atob(tokens[name].split('.')[1])
  const timeToken = JSON.parse(decodeAccess).exp * 1000
  console.log('token:время текущего токена', timeToken)
  return timeToken > currentDate ? tokens[name] : null
}

export const setTriggerAuth = (triggerDate) => {
  return setStorage('triggerAuthDate', triggerDate.toString())
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const addSessionId = () => {
  const sessionId = JSON.parse(getStorage('session-id'))
  const tokens = JSON.parse(getStorage('tokens'))

  if (!sessionId) {
    return {}
  }

  return tokens ? { 'session-id': sessionId } : {}
}

export const getRole = () => {
  const user = JSON.parse(getStorage('user'))
  return roles[user?.roleId]
}

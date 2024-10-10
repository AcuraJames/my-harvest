import { generateRequestId } from '@/utils/requestId'

export const apiRequest = async (path, method, params, token, options, sessionId) => {
  return await fetch(path, {
    ...(options && { ...options }),
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(sessionId && sessionId),
      accept: 'application/json',
      'request-id': generateRequestId(),
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(params)
  })
}

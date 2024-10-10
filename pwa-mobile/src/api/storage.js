import { generateRequestId } from '@/utils/requestId'
import { currentSettings } from '@/settings'
import { errorsTranslate } from '@/constants/errorsTranslate'

const URL = currentSettings.api.URL_API_ST
export const getUrlImg = async (token, file) => {
  const response = await fetch(`${URL}/v1/private/file`, {
    method: 'POST',
    headers: {
      accept: 'application/json;charset=utf-8',
      'request-id': generateRequestId(),
      authorization: 'Bearer ' + token
    },
    body: file
  })
  if (!response.ok) {
    const errorMsg = (await response.text()).replace('\n', '')
    return { message: errorsTranslate[errorMsg.split('{')[0]] }
  }

  return { success: true, data: await response.json() }
}

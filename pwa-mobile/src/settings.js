const settings = {
  dev: {
    api: {
      URL_API_AUTH: 'https://api.auth.agropoisk.info',
      URL_API_WS: 'https://api.ws.mh.agropoisk.info',
      URL_API_ST: 'https://api.storage.agropoisk.info'
    }
  },
  prod: {
    api: {
      URL_API_AUTH: 'https://api.auth.agropoisk.ru',
      URL_API_WS: 'https://api.ws.mh.agropoisk.ru',
      URL_API_ST: 'https://api.storage.agropoisk.ru'
    }
  }
}

export const currentSettings = settings[process.env.VUE_APP_TARGET_ENV]

// Очистка кэша сервис-воркера
const clearCache = async function () {
  await window['caches']['keys']().then(function (cacheNames) {
    return Promise.all(
      cacheNames.map(function (cacheName) {
        return window['caches']['delete'](cacheName)
      })
    )
  })
}

// Удаление всех сервис-воркеров
const deleteAll = async function () {
  navigator['serviceWorker']['getRegistrations']().then(function (param_isRegistrations_obj) {
    for (let var_isRegistration_obj of param_isRegistrations_obj) {
      var_isRegistration_obj['unregister']()
    }
  })
}

export const ServiceWorker = {
  clearCache,
  deleteAll
}

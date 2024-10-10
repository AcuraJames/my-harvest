<script setup>
import AppHeader from '@/components/AppHeader'
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getStorage, removeFromStorage } from '@/utils/common'
import { roles } from '@/constants/roles'

const store = useStore()
const router = useRouter()

const role = ref(null)

const savedData = ref(null)

const vehicleNumber = computed(() => savedData.value.vehicle.toUpperCase())
const trailerNumber = computed(() => (savedData.value.trailer ? savedData.value.trailer.toUpperCase() : null))

const netWeight = computed(() => savedData.value.fullWeight - savedData.value.containerWeight)
const specificationsTextLists = computed(() =>
  savedData.value.specificationsTextLists.map((spec) => {
    return { specificationId: spec.specificationId, valueId: spec.valueId }
  })
)

const createHarvest = async () => {
  let res = null
  if (role.value === 'Weigher') {
    res = await store.dispatch('createWeigherHarvest', {
      harvest: {
        container: {
          carLicencePlate: vehicleNumber.value,
          trailerLicencePlate: trailerNumber.value,
          weightKg: +savedData.value.containerWeight
        },
        cultureId: savedData.value.product.id,
        fieldId: savedData.value.childField.id,
        netWeightKg: netWeight.value,
        specificationTextLists: specificationsTextLists.value,
        images: savedData.value.photos
      }
    })
  } else {
    res = await store.dispatch('createStorekeeperHarvest', {
      harvest: {
        container: {
          carLicencePlate: vehicleNumber.value,
          trailerLicencePlate: trailerNumber.value,
          weightKg: +savedData.value.containerWeight
        },
        cultureId: savedData.value.product.id,
        fieldId: savedData.value.childField.id,
        netWeightKg: netWeight.value,
        specificationTextLists: specificationsTextLists.value,
        warehouseId: savedData.value.warehouseZone.id,
        images: savedData.value.photos
      }
    })
  }
  if (res?.success) {
    removeFromStorage('form-data')
    store.commit('sendSuccess', { success: res?.success, message: 'Данные успешно отправлены' })
    await router.push({ name: 'home' })
  } else {
    store.commit('sendError', res)
    router.back()
  }
}

onBeforeMount(() => {
  savedData.value = JSON.parse(getStorage('form-data'))
  const user = JSON.parse(getStorage('user'))
  role.value = roles[user.roleId]
  window.scrollTo(0, 0)
})
</script>

<template>
  <AppHeader />
  <v-alert type="info" icon="$alertIcon" text="Проверьте корректность введенных данных" variant="tonal" />
  <div v-if="savedData" class="harvest-check pb-12 mb-16">
    <div class="harvest-check__row">
      <span class="harvest-check__text">Машина: </span>
      <span class="harvest-check__descr">{{ vehicleNumber }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Телега/Прицеп: </span>
      <span class="harvest-check__descr">{{ trailerNumber }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Вес с тарой: </span>
      <span class="harvest-check__descr">{{ savedData.fullWeight }} кг</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Вес тары: </span>
      <span class="harvest-check__descr">{{ savedData.containerWeight }} кг</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Чистый вес: </span>
      <span class="harvest-check__descr">{{ netWeight }} кг</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Тип культуры: </span>
      <span class="harvest-check__descr">{{ savedData.culture.culture }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Сорт: </span>
      <span class="harvest-check__descr">{{ savedData.product.culture }}</span>
    </div>
    <div class="harvest-check__row" v-for="spec in savedData.specificationsTextLists" :key="spec.id">
      <span class="harvest-check__text">{{ spec.name }}: </span>
      <span class="harvest-check__descr">{{ spec.value }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Поле: </span>
      <span class="harvest-check__descr">{{ savedData.rootField.field }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Участок поля: </span>
      <span class="harvest-check__descr">{{ savedData.childField.field }}</span>
    </div>

    <template v-if="role === 'Storekeeper'">
      <div class="harvest-check__row">
        <span class="harvest-check__text">Хранилище: </span>
        <span class="harvest-check__descr">{{ savedData.warehouse.warehouse }}</span>
      </div>
      <div class="harvest-check__row">
        <span class="harvest-check__text">Зона хранилища: </span>
        <span class="harvest-check__descr">{{ savedData.warehouseZone.warehouse }}</span>
      </div>
    </template>

    <div class="harvest-check__row">
      <span class="harvest-check__text">Фото документа: </span>
      <span class="harvest-check__descr">{{ savedData.photos.length }} файлов</span>
    </div>
  </div>
  <div class="footer-btn">
    <v-btn class="mr-2" variant="outlined" prepend-icon="$arrowBack" @click="router.back()">Назад</v-btn>
    <v-btn class="flex-1-1-100" color="primary" @click="createHarvest">Подтвердить</v-btn>
  </div>
</template>

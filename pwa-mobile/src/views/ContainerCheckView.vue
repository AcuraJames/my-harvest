<script setup>
import AppHeader from '@/components/AppHeader'
import { ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getStorage, removeFromStorage } from '@/utils/common'

const store = useStore()
const router = useRouter()

const savedData = ref(null)

const createHarvest = async () => {
  const res = await store.dispatch('createContainer', {
    container: {
      carLicencePlate: savedData.value.vehicle.toUpperCase(),
      trailerLicencePlate: savedData.value.trailer?.toUpperCase(),
      weightKg: +savedData.value.containerWeight,
      images: savedData.value.photos
    }
  })
  if (res?.success) {
    removeFromStorage('container-form-data')
    store.commit('sendSuccess', { success: res?.success, message: 'Данные успешно отправлены' })
    await router.push({ name: 'home' })
  } else {
    store.commit('sendError', res)
    router.back()
  }
}

onBeforeMount(() => (savedData.value = JSON.parse(getStorage('container-form-data'))))
</script>

<template>
  <AppHeader />
  <v-alert type="info" icon="$alertIcon" text="Проверьте корректность введенных данных" variant="tonal" />
  <div v-if="savedData" class="harvest-check">
    <div class="harvest-check__row">
      <span class="harvest-check__text">Машина: </span>
      <span class="harvest-check__descr">{{ savedData.vehicle.toUpperCase() }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Телега/Прицеп: </span>
      <span class="harvest-check__descr">{{ savedData.trailer?.toUpperCase() }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Вес тары: </span>
      <span class="harvest-check__descr">{{ savedData.containerWeight }} кг</span>
    </div>
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

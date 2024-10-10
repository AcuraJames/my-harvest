<script setup>
import AppHeader from '@/components/AppHeader'
import { ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getStorage, removeFromStorage } from '@/utils/common'

const store = useStore()
const router = useRouter()

const savedData = ref(null)

const createHarvestedArea = async () => {
  const res = await store.dispatch('createHarvestedArea', {
    fieldId: savedData.value.childField.id,
    AreaAc: +(savedData.value.harvestedArea * 100).toFixed(2)
  })
  console.log('RES', res)
  if (res?.success) {
    removeFromStorage('analytics-form-data')
    store.commit('sendSuccess', { success: res?.success, message: 'Данные успешно отправлены' })
    await router.push({ name: 'analytics' })
  } else {
    store.commit('sendError', res)
    router.back()
  }
}

onBeforeMount(() => (savedData.value = JSON.parse(getStorage('analytics-form-data'))))
</script>

<template>
  <AppHeader />
  <v-alert type="info" icon="$alertIcon" text="Проверьте корректность введенных данных" variant="tonal" />
  <div v-if="savedData" class="harvest-check">
    <div class="harvest-check__row">
      <span class="harvest-check__text">Поле: </span>
      <span class="harvest-check__descr">{{ savedData.rootField.field }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Участок: </span>
      <span class="harvest-check__descr">{{ savedData.childField.field }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Кол-во убранных Га: </span>
      <span class="harvest-check__descr">{{ savedData.harvestedArea }} Га</span>
    </div>
  </div>
  <div class="footer-btn">
    <v-btn class="mr-2" variant="outlined" prepend-icon="$arrowBack" @click="router.back()">Назад</v-btn>
    <v-btn class="flex-1-1-100" color="primary" @click="createHarvestedArea">Подтвердить</v-btn>
  </div>
</template>

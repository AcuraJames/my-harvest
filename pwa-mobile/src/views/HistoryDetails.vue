<script setup>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { getRole } from '@/utils/common'

const store = useStore()
const route = useRoute()
const role = getRole()

const data = ref(null)
const culture = ref(null)
const field = ref(null)
const warehouse = ref(null)

const harvestId = computed(() => +route.params?.id)
const containerWeight = computed(() => data.value?.container?.weightKg + data.value?.netWeightKg)

const getHistory = async (params) => (data.value = await store.dispatch(`get${role}HarvestHistory`, params))
const getCulture = async (params) => (culture.value = await store.dispatch('getCultures', params))
const getField = async (params) => (field.value = await store.dispatch('getFields', params))
const getWarehouse = async (params) => (warehouse.value = await store.dispatch('getWarehouses', params))

const getAllData = async () => {
  await getHistory({ harvestId: harvestId.value })
  await getCulture({ child: false, cultureId: data.value?.culture?.parentId })
  await getField({ child: false, fieldId: data.value?.field?.parentId })
  await getWarehouse({ child: false, warehouseId: data.value?.warehouse?.parentId })
}

onBeforeMount(() => {
  getAllData()
  window.scrollTo(0, 0)
})
</script>

<template>
  <AppHeader />
  <div v-if="data" class="harvest-check pb-12 mb-16">
    <div class="harvest-check__row">
      <span class="harvest-check__text">Машина: </span>
      <span class="harvest-check__descr">{{ data.container?.carLicencePlate }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Телега/Прицеп: </span>
      <span class="harvest-check__descr">{{ data.container?.trailerLicencePlate }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Вес с тарой: </span>
      <span class="harvest-check__descr">{{ containerWeight }} кг</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Вес тары: </span>
      <span class="harvest-check__descr">{{ data.container?.weightKg }} кг</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Чистый вес: </span>
      <span class="harvest-check__descr">{{ data.netWeightKg }} кг</span>
    </div>
    <div v-if="culture" class="harvest-check__row">
      <span class="harvest-check__text">Тип культуры: </span>
      <span class="harvest-check__descr">{{ culture.culture?.culture }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Сорт: </span>
      <span class="harvest-check__descr">{{ data.culture?.culture }}</span>
    </div>
    <div class="harvest-check__row" v-for="spec in data.specificationsTextLists" :key="spec.id">
      <span class="harvest-check__text">{{ spec.name }}: </span>
      <span class="harvest-check__descr">{{ spec.textList?.value }}</span>
    </div>
    <div v-if="field" class="harvest-check__row">
      <span class="harvest-check__text">Поле: </span>
      <span class="harvest-check__descr">{{ field.field?.field }}</span>
    </div>
    <div class="harvest-check__row">
      <span class="harvest-check__text">Участок поля: </span>
      <span class="harvest-check__descr">{{ data.field?.field }}</span>
    </div>

    <template v-if="role === 'Storekeeper'">
      <div v-if="warehouse" class="harvest-check__row">
        <span class="harvest-check__text">Хранилище: </span>
        <span class="harvest-check__descr">{{ warehouse.warehouse?.warehouse }}</span>
      </div>
      <div class="harvest-check__row">
        <span class="harvest-check__text">Зона хранилища: </span>
        <span class="harvest-check__descr">{{ data.warehouse?.warehouse }}</span>
      </div>
    </template>

    <div class="harvest-check__row">
      <span class="harvest-check__text">Фото документа: </span>
      <span class="harvest-check__descr">{{ data.images?.length }} файлов</span>
    </div>
  </div>
  <AppFooter />
</template>

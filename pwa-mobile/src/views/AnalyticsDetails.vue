<script setup>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import AppLoader from '@/components/AppLoader'
import AnalyticsHead from '@/components/elements/AnalyticsHead'
import AnalyticsGeneralStats from '@/components/elements/AnalyticsGeneralStats'
import AnalyticsInfoList from '@/components/elements/AnalyticsInfoList'
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getRole, getStorage, setStorage } from '@/utils/common'
import { reduceObject } from '@/utils/statistics'
import { getDayTSBounds } from '@/utils/dates'
import { analyticsPageNames } from '@/constants/analyticsPageNames'

const store = useStore()
const route = useRoute()
const router = useRouter()

const role = getRole()
const reducer = reduceObject
const breadcrumbs = ref([])
const fieldId = ref(null)
const isLoading = ref(true)
const isRoot = ref(true)
const date = ref(new Date())
const data = ref(null)
const dataType = ref(null)
const dataBySlug = reactive({
  cultures: () =>
    getCulturesStats({
      filter: {
        cultureId: null,
        fieldId: null,
        ...getDayTSBounds(date.value?.valueOf() / 1000)
      }
    }),
  fields: () =>
    getFieldsStats({
      filter: {
        fieldId: null,
        ...getDayTSBounds(date.value?.valueOf() / 1000)
      }
    }),
  warehouses: () =>
    getWarehousesStats({
      filter: {
        cultureId: null,
        warehouseId: null,
        ...getDayTSBounds(date.value?.valueOf() / 1000)
      }
    })
})
const culturesByField = ref(null)

const netWeight = computed(() =>
  dataType.value === 'fields'
    ? data.value?.reduce(reducer('netWeightStorekeeper'), 0)
    : data.value?.reduce(reducer('netWeightStorekeeperKg'), 0)
)
const harvestedArea = computed(() => data.value?.reduce(reducer('harvestedAreaAc'), 0))

const getCulturesStats = async (params) => (data.value = await store.dispatch('getCulturesStatistics', params))
const getFieldsStats = async (params) => (data.value = await store.dispatch('getFieldsStatistics', params))
const getWarehousesStats = async (params) => (data.value = await store.dispatch('getWarehousesStatistics', params))

const goToNext = async (title, id) => {
  breadcrumbs.value.push(title)
  breadcrumbs.value = [...new Set(breadcrumbs.value)]
  fieldId.value = getStorage('field-id')
  setStorage('analytics-breadcrumbs', JSON.stringify(breadcrumbs.value))
  switch (dataType.value) {
    case 'cultures':
      await getCulturesStats({
        filter: {
          cultureId: id,
          fieldId: fieldId.value ? +fieldId.value : null,
          ...getDayTSBounds(date.value?.valueOf() / 1000)
        }
      })
      break
    case 'fields':
      await getFieldsStats({
        filter: {
          fieldId: id,
          ...getDayTSBounds(date.value?.valueOf() / 1000)
        }
      })
      break
    case 'warehouses':
      await getWarehousesStats({
        filter: {
          cultureId: 1,
          warehouseId: id,
          ...getDayTSBounds(date.value?.valueOf() / 1000)
        }
      })
  }
  router.push({ name: 'analytics-details', params: { slug: title } })
  isLoading.value = false
  isRoot.value = false
}

const getCultureByField = (title, id) => {
  dataType.value = 'cultures'
  breadcrumbs.value.push(title)
  setStorage('field-id', id)
  getCulturesStats({
    filter: {
      cultureId: null,
      fieldId: id,
      ...getDayTSBounds(date.value?.valueOf() / 1000)
    }
  })
  router.push({ name: 'analytics-details', params: { slug: title } })
}

const getCultureByWarehouse = (title, id, parentId) => {
  setStorage('warehouse-id', id)
  setStorage('warehouse-parent-id', parentId)
  getCulturesStats({
    filter: {
      cultureId: 1,
      fieldId: null,
      ...getDayTSBounds(date.value?.valueOf() / 1000)
    }
  })
  router.push({ name: 'product-details', params: { slug: title, id: 1 } })
}

const getProductDetails = (title, id) => {
  breadcrumbs.value.push(title)
  setStorage('analytics-last-screen', JSON.stringify(true))
  setStorage('analytics-breadcrumbs', JSON.stringify(breadcrumbs.value))
  router.push({ name: 'product-details', params: { slug: title, id } })
}

const goToCategory = (category, index) => {
  router.push({ name: 'analytics-details', params: { slug: category } })
  breadcrumbs.value.splice(index + 1)
}

const goBack = () => {
  router.push({ name: 'analytics' })
  // if (breadcrumbs.value.length === 1) {
  //   return
  // }
  // breadcrumbs.value.pop()
  // setStorage('analytics-last-screen', true)
  // setStorage('analytics-breadcrumbs', JSON.stringify(breadcrumbs.value))
  // router.push({ name: 'analytics-details', params: { slug: breadcrumbs.value[breadcrumbs.value.length - 1] } })
}

const getDataBySlug = () => {
  for (const key in analyticsPageNames) {
    if (analyticsPageNames[key] === route.params.slug) {
      dataType.value = key
      dataBySlug[key]()
      isLoading.value = false
    }
  }
}

watch(
  () => route.params.slug,
  () => getDataBySlug()
)

onBeforeMount(() => {
  const isLast = JSON.parse(getStorage('analytics-last-screen')) || false
  breadcrumbs.value = JSON.parse(getStorage('analytics-breadcrumbs')) || []
  date.value = JSON.parse(getStorage('analytics-date'))
  if (isLast) {
    fieldId.value = getStorage('field-id')
    dataType.value = getStorage('analytics-data-type')
    switch (dataType.value) {
      case 'cultures':
        getCulturesStats({
          filter: {
            cultureId: 1,
            fieldId: fieldId.value ? +fieldId.value : null,
            ...getDayTSBounds(date.value?.valueOf() / 1000)
          }
        })
        break
      case 'fields':
        getFieldsStats({
          filter: {
            fieldId: fieldId.value ? +fieldId.value : null,
            ...getDayTSBounds(date.value?.valueOf() / 1000)
          }
        })
        break
      case 'warehouses':
        getWarehousesStats({
          filter: {
            cultureId: 1,
            warehouseId: 1,
            ...getDayTSBounds(date.value?.valueOf() / 1000)
          }
        })
        break
    }
    setStorage('analytics-last-screen', false)
    isLoading.value = false
  }
  getDataBySlug()
})
</script>

<template>
  <AppHeader :title="route.params.slug">
    <template #prepend>
      <v-icon @click="goBack">$arrowBack</v-icon>
    </template>
  </AppHeader>
  <AppLoader v-if="isLoading" />
  <div v-else class="analytics-details">
    <AnalyticsHead :date="date" />
    <div class="analytics-details__breadcrumbs">
      <span v-for="(item, index) in breadcrumbs" :key="index" @click="goToCategory(item, index)">{{ item }}</span>
    </div>
    <AnalyticsGeneralStats v-if="dataType !== 'warehouses'" :net-weight="netWeight" :harvested-area="harvestedArea" />
    <AnalyticsInfoList
      :items="data"
      :field-cultures="culturesByField"
      :data-type="dataType"
      :key="step"
      @next="goToNext"
      @cultures:field="getCultureByField"
      @cultures:warehouse="getCultureByWarehouse"
      @product:details="getProductDetails" />
  </div>
  <AppFooter :role="role" />
</template>

<style scoped lang="scss">
@import '@/assets/scss/analytics-details.scss';
</style>

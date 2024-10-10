<script setup>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import AppLoader from '@/components/AppLoader'
import AnalyticsHead from '@/components/elements/AnalyticsHead'
import AnalyticsGeneralStats from '@/components/elements/AnalyticsGeneralStats'
import AnalyticsInfoCard from '@/components/elements/AnalyticsInfoCard'
import DatePicker from '@/components/elements/DatePicker'
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getRole, getStorage, setStorage } from '@/utils/common'
import { getDayTSBounds, formatTimestamp } from '@/utils/dates'
import { reduceObject } from '@/utils/statistics'
import { analyticsPageNames } from '@/constants/analyticsPageNames'
import appVersion from 'raw-loader!/public/VERSION'

const store = useStore()
const router = useRouter()
const role = getRole()
const reducer = reduceObject

const success = ref({})

const names = analyticsPageNames
const cultures = ref(null)
const fields = ref(null)
const warehouses = ref(null)
const daysStats = ref(null)
const isLoading = ref(true)
const currentDate = ref(new Date())
const isCustomDate = ref(false)
const showDatePicker = ref(false)
const activeTab = ref(0)
const tabs = [
  { name: 'AllTime', label: 'Всего' },
  { name: 'Today', label: 'За сегодня' },
  { name: 'Yesterday', label: 'За вчера' }
]

const culturesList = computed(() => cultures.value?.map((culture) => culture.culture.culture) || [])
const culturesNetWeight = computed(() => cultures.value?.reduce(reducer('netWeightStorekeeperKg'), 0))
const culturesHarvestedArea = computed(() => cultures.value?.reduce(reducer('harvestedAreaAc'), 0))

const fieldsNetWeight = computed(() => fields.value?.reduce(reducer('netWeightStorekeeper'), 0))
const fieldsHarvestedArea = computed(() => fields.value?.reduce(reducer('harvestedAreaAc'), 0))
const fieldsTotalHectares = computed(() => fields.value?.reduce(reducer('harvestedAreaAc'), 0))
const fieldsCapacity = computed(() => fields.value?.reduce(reducer('plantedAreaAcAccumulated'), 0))

const warehousesTotalTons = computed(() => warehouses.value?.reduce(reducer('totalHarvestedKg'), 0))
const warehousesCapacity = computed(() => warehouses.value?.reduce((acc, curr) => acc + curr.warehouse?.capacityKg, 0))

const chartLabels = computed(() =>
  daysStats.value?.map((day) => formatTimestamp(day.day, { day: '2-digit', month: '2-digit' }))
)
const chartData = computed(() => daysStats.value?.map((day) => day.netWeightKg / 1000))

const chartConfig = computed(() => {
  return {
    data: {
      labels: chartLabels.value,
      datasets: [
        {
          data: chartData.value,
          backgroundColor: '#0075d7',
          label: 'Урожай в тоннах'
        }
      ]
    }
  }
})

const selectTab = (index) => {
  let date = new Date()
  activeTab.value = index
  switch (activeTab.value) {
    case 1:
      date = new Date(date).getTime()
      break
    case 2:
      date = date.setUTCDate(date.getUTCDate() - 1)
      break
    default:
      date = null
  }
  currentDate.value = date
  getAllStats(currentDate.value)
  setStorage('analytics-tab', activeTab.value)
  setStorage('analytics-date', currentDate.value)
}

const setDate = () => {
  setStorage('analytics-date', currentDate.value)
  getAllStats(currentDate.value)
  showDatePicker.value = false
  isCustomDate.value = true
}

const resetDate = () => {
  selectTab(activeTab.value)
  isCustomDate.value = false
}

const goToDetails = (title, type) => {
  const breadcrumbs = [title]
  setStorage('analytics-data-type', type)
  setStorage('analytics-breadcrumbs', JSON.stringify(breadcrumbs))
  router.push({ name: 'analytics-details', params: { slug: title } })
}

const getCulturesStats = async (params) => (cultures.value = await store.dispatch('getCulturesStatistics', params))
const getFieldsStats = async (params) => (fields.value = await store.dispatch('getFieldsStatistics', params))
const getWarehousesStats = async (params) =>
  (warehouses.value = await store.dispatch('getWarehousesStatistics', params))
const getStatsByDays = async (params) => (daysStats.value = await store.dispatch('getHarvestStatisticsByDays', params))

const getAllStats = async (date) => {
  await getCulturesStats({
    filter: {
      cultureId: null,
      fieldId: null,
      ...getDayTSBounds(date?.valueOf() / 1000)
    }
  })
  await getFieldsStats({
    filter: {
      fieldId: null,
      ...getDayTSBounds(date?.valueOf() / 1000)
    }
  })
  await getWarehousesStats({
    filter: {
      cultureId: null,
      warehouseId: null,
      ...getDayTSBounds(date?.valueOf() / 1000)
    }
  })
  await getStatsByDays({
    filter: {
      startTime: null,
      finishTime: getDayTSBounds(date?.valueOf() / 1000).finishTime
    }
  })
  isLoading.value = false
}

onBeforeMount(() => {
  const tab = getStorage('analytics-tab') || 0
  setStorage('field-id', '')
  selectTab(+tab)
  getAllStats(currentDate.value)
  success.value = store.getters.isSuccess
})
</script>

<template>
  <AppHeader no-back="true" />
  <AppLoader v-if="isLoading" />
  <div v-else class="analytics-wrap mb-8">
    <AnalyticsHead :date="currentDate" :clearable="isCustomDate" @reset="resetDate" />
    <section class="analytics-section mb-4">
      <div class="analytics-descr">
        <div class="analytics-descr__wrap">
          <div v-if="!isCustomDate" class="analytics-descr__switcher">
            <div class="analytics-descr__switcher-wrap">
              <button
                v-for="(tab, idx) in tabs"
                :key="idx"
                type="button"
                :class="['analytics-descr__switcher-btn', { active: activeTab === idx }]"
                @click="selectTab(idx)">
                <v-icon size="24" :color="activeTab === idx ? 'primary' : 'dark-grey'">{{ `$tab${tab.name}` }}</v-icon>
                {{ tab.label }}
              </button>
            </div>
            <v-icon @click="showDatePicker = true">$calendar</v-icon>
          </div>
          <AnalyticsGeneralStats
            is-main="true"
            :net-weight="culturesNetWeight"
            :harvested-area="culturesHarvestedArea" />
        </div>
      </div>
    </section>

    <section class="analytics-section">
      <AnalyticsInfoCard
        v-if="culturesList?.length"
        :items="culturesList"
        :net-weight="culturesNetWeight"
        :title="names.cultures"
        allow-next="true"
        @click:open="goToDetails(names.cultures, 'cultures')" />
      <AnalyticsInfoCard
        v-if="fields?.length"
        is-capacity="true"
        has-yield="true"
        data-type="fields"
        :net-weight="fieldsNetWeight"
        :harvested-area="fieldsHarvestedArea"
        :total-tons="fieldsTotalHectares"
        :capacity="fieldsCapacity"
        :title="names.fields"
        :chart-config="chartConfig"
        allow-next="true"
        @click="goToDetails(names.fields, 'fields')" />
      <AnalyticsInfoCard
        v-if="warehouses?.length"
        is-capacity="true"
        data-type="warehouses"
        :total-tons="warehousesTotalTons"
        :capacity="warehousesCapacity"
        :title="names.warehouses"
        allow-next="true"
        @click="goToDetails(names.warehouses, 'warehouses')" />
    </section>
  </div>

  <v-overlay v-model="showDatePicker" class="d-flex justify-center align-center">
    <DatePicker v-model:timestamp="currentDate" @applyDate="setDate" @close="showDatePicker = false" />
  </v-overlay>

  <v-snackbar v-model="success.success" timeout="2000" color="success">
    {{ success.message }}
  </v-snackbar>

  <div class="app-version text-light-grey">{{ appVersion }}</div>

  <AppFooter :role="role" />
</template>

<style scoped lang="scss">
@import '@/assets/scss/analytics.scss';
</style>

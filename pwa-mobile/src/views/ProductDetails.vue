<script setup>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import AppLoader from '@/components/AppLoader'
import AnalyticsHead from '@/components/elements/AnalyticsHead'
import AnalyticsGeneralStats from '@/components/elements/AnalyticsGeneralStats'
import AnalyticsInfoCard from '@/components/elements/AnalyticsInfoCard'
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getRole, getStorage, setStorage } from '@/utils/common'
import { getDayTSBounds } from '@/utils/dates'

const store = useStore()
const route = useRoute()
const router = useRouter()
const role = getRole()

const data = ref(null)
const dataType = ref('')
const breadcrumbs = ref([])
const date = ref(new Date())
const isLoading = ref(true)
const isRoot = ref(false)
const warehouseId = ref(null)

const cultureId = computed(() => +route.params.id)
const cultureStat = computed(() => data.value?.cultureStat)
const specifications = computed(() =>
  dataType.value !== 'warehouses'
    ? data.value?.specifications
    : data.value?.specifications?.filter((spec) => spec.name === 'Репродукция')
)
const netWeight = computed(() => cultureStat.value?.netWeightStorekeeperKg)
const harvestedArea = computed(() => cultureStat.value?.harvestedAreaAc)
const warehouses = computed(
  () => isRoot.value && data.value?.filter((item) => item.warehouse?.id === +warehouseId.value)
)

const getCultureBySpec = async (params) => (data.value = await store.dispatch('getCultureBySpecification', params))
const getCultureByField = async (params) => (data.value = await store.dispatch('getCulturesStatistics', params))
const getWarehouseBySpec = async (params) =>
  (data.value = await store.dispatch('getWarehouseBySpecificationStatistics', params))
const getWarehousesStats = async (params) => (data.value = await store.dispatch('getWarehousesStatistics', params))

const getWarehouseDetails = (title, id) => {
  getWarehouseBySpec({
    cultureId: id,
    filter: {
      warehouseId: warehouseId.value ? +warehouseId.value : null,
      startTime: getDayTSBounds(date.value?.valueOf() / 1000).startTime
    }
  })
  isRoot.value = false
  router.push({ name: 'product-details', params: { slug: title, id } })
}

const goToCategory = (category, index) => {
  breadcrumbs.value.splice(index + 1)
  setStorage('analytics-breadcrumbs', JSON.stringify(breadcrumbs.value))
  router.push({ name: 'analytics-details', params: { slug: category } })
}

const goBack = () => {
  if (breadcrumbs.value.length === 1) {
    router.push({ name: 'analytics' })
    return
  }
  breadcrumbs.value.pop()
  setStorage('analytics-breadcrumbs', JSON.stringify(breadcrumbs.value))
  router.push({ name: 'analytics-details', params: { slug: breadcrumbs.value[breadcrumbs.value.length - 1] } })
}

const getData = async () => {
  breadcrumbs.value = JSON.parse(getStorage('analytics-breadcrumbs')) || []
  date.value = JSON.parse(getStorage('analytics-date'))
  dataType.value = getStorage('analytics-data-type')
  warehouseId.value = getStorage('warehouse-id')
  const warehouseParentId = getStorage('warehouse-parent-id')
  const fieldId = getStorage('field-id')

  if (dataType.value === 'fields') {
    await getCultureByField({
      filter: {
        cultureId: cultureId.value,
        fieldId: +fieldId.value,
        ...getDayTSBounds(date.value?.valueOf() / 1000)
      }
    })
  } else if (dataType.value === 'warehouses') {
    isRoot.value = true
    await getWarehousesStats({
      filter: {
        cultureId: 1,
        warehouseId: +warehouseParentId,
        ...getDayTSBounds(date.value?.valueOf() / 1000)
      }
    })
  } else {
    await getCultureBySpec({
      cultureId: cultureId.value,
      filter: { fieldId: fieldId ? +fieldId : null },
      startTime: getDayTSBounds(date.value?.valueOf() / 1000).startTime
    })
  }
  isLoading.value = false
}

onBeforeMount(() => getData())
</script>

<template>
  <AppHeader :title="route.params.slug">
    <template #prepend>
      <v-icon @click="goBack">$arrowBack</v-icon>
    </template>
  </AppHeader>
  <AppLoader v-if="isLoading" />
  <template v-else>
    <AnalyticsHead :date="date" />
    <div class="analytics-details__breadcrumbs">
      <span v-for="(item, index) in breadcrumbs" :key="index" @click="goToCategory(item, index)">{{ item }}</span>
    </div>
    <AnalyticsGeneralStats
      v-if="dataType !== 'warehouses'"
      :net-weight="netWeight"
      :harvested-area="harvestedArea"
      is-exact="true" />
    <AnalyticsInfoCard
      v-if="dataType !== 'warehouses'"
      data-type="fields"
      is-capacity="true"
      :title="cultureStat?.culture?.culture"
      :total-tons="cultureStat?.harvestedAreaAc"
      :capacity="cultureStat?.plantedAreaAcAccumulated" />
    <template v-if="dataType === 'warehouses'">
      <AnalyticsInfoCard
        data-type="warehouses"
        v-for="spec in specifications"
        :key="spec.id"
        is-capacity="true"
        :name="spec.textLists[0]?.value"
        :total-tons="spec.textLists[0]?.netWeightStorekeeperKg"
        :capacity="data.stat?.capacityKg"
        :title="spec.name" />
    </template>
    <AnalyticsInfoCard
      v-else
      data-type="warehouses"
      v-for="spec in specifications"
      :key="spec.id"
      is-capacity="true"
      :multiply-stats="spec.textLists"
      :title="spec.name" />
    <template v-if="isRoot">
      <template v-for="warehouse in warehouses">
        <AnalyticsInfoCard
          v-for="culture in warehouse.harvestsStats"
          :key="culture.culture?.id"
          data-type="warehouses"
          is-capacity="true"
          allow-next="true"
          :title="culture.culture?.culture"
          :total-tons="culture.sumKg"
          :capacity="warehouse.warehouse?.capacityKg"
          @click="getWarehouseDetails(culture.culture?.culture, culture.culture?.id)" />
      </template>
    </template>
  </template>
  <AppFooter :role="role" />
</template>

<style scoped lang="scss">
@import '@/assets/scss/analytics-details.scss';
</style>

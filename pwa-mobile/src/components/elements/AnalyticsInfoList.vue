<script setup>
import AnalyticsInfoCard from '@/components/elements/AnalyticsInfoCard'
import { defineProps, defineEmits, ref, computed, onBeforeMount } from 'vue'
import { getStorage, setStorage } from '@/utils/common'

const props = defineProps(['items', 'fieldCultures', 'dataType'])
const emit = defineEmits(['next', 'cultures:field', 'cultures:warehouse', 'product:details'])

const date = ref(new Date())
const step = ref(0)
const steps = ref([])

const fieldCultureItems = computed(() => {
  const cultures = []
  props.fieldCultures?.map((field) =>
    field.children?.map((child) => {
      cultures.push(child.culture)
    })
  )
  return cultures
})

const cultureItems = (item) => item.children?.map((child) => child.culture)
const fieldItems = (item) =>
  fieldCultureItems.value ? fieldCultureItems.value : item.cultures?.map((culture) => culture.culture)
const warehouseItems = (item) => item.harvestsStats?.map((stat) => stat.culture?.culture)

const next = (title, id, item) => {
  step.value += 1
  steps.value.push(props.items)
  console.warn(steps.value)
  setStorage('analytics-details-step', JSON.stringify(steps.value))
  if (item.children || item.hasChildren || item.hasChild) {
    if (item.field) setStorage('analytics-data-type', 'fields')
    if (item.culture) setStorage('analytics-data-type', 'cultures')
    emit('next', title, id)
  } else {
    if (item.field) {
      setStorage('analytics-data-type', 'fields')
      emit('cultures:field', title, id)
    } else if (item.warehouse) {
      setStorage('analytics-data-type', 'warehouses')
      emit('cultures:warehouse', title, id, item.warehouse.parentId)
    } else {
      setStorage('analytics-data-type', 'cultures')
      emit('product:details', title, id)
    }
  }
}

onBeforeMount(() => (date.value = JSON.parse(getStorage('analytics-date'))))
</script>

<template>
  <template v-if="dataType === 'cultures'">
    <div v-for="item in items" :key="item.id">
      <AnalyticsInfoCard
        v-if="item.netWeightStorekeeperKg"
        :items="cultureItems(item)"
        :net-weight="item.netWeightStorekeeperKg"
        :harvested-area="item.harvestedAreaAc"
        :title="item.culture?.culture"
        :allow-next="true"
        has-yield="true"
        @click:open="next(item.culture?.culture, item.culture?.id, item)" />
    </div>
  </template>
  <template v-if="dataType === 'fields'">
    <div v-for="item in items" :key="item.id">
      <AnalyticsInfoCard
        v-if="item.netWeightStorekeeper"
        data-type="fields"
        :items="fieldItems(item)"
        :net-weight="item.netWeightStorekeeper"
        :harvested-area="item.harvestedAreaAc"
        :title="item.field?.field"
        :total-tons="item.harvestedAreaAc"
        :capacity="item.plantedAreaAc"
        is-capacity="true"
        has-yield="true"
        allow-next="true"
        @click:open="next(item.field?.field, item.field?.id, item)" />
    </div>
  </template>
  <template v-if="dataType === 'warehouses'">
    <div v-for="item in items" :key="item.id">
      <AnalyticsInfoCard
        v-if="item.totalHarvestedKg"
        :items="warehouseItems(item)"
        data-type="warehouses"
        :total-tons="item.totalHarvestedKg"
        :capacity="item.warehouse?.capacityKg"
        :title="item.warehouse?.warehouse"
        is-capacity="true"
        allow-next="true"
        @click:open="next(item.warehouse?.warehouse, item.warehouse?.id, item)" />
    </div>
  </template>
</template>

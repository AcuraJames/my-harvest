<script setup>
import DataInput from '@/components/elements/DataInput'
import { ref, computed, onBeforeMount, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps(['isNew', 'warehouse', 'warehouseZone'])
const emit = defineEmits(['update:warehouse', 'update:warehouseZone'])

const allWarehouses = ref(null)

const warehouses = computed(() => allWarehouses.value?.children.filter((child) => !child.parentId))
const warehouseZones = computed(() =>
  allWarehouses.value?.children.filter((child) => child.parentId === props.warehouse?.id)
)

const warehouseModel = computed(() => (props.isNew ? props.warehouse : props.warehouse?.warehouse))
const warehouseZoneModel = computed(() => (props.isNew ? props.warehouseZone : props.warehouseZone?.warehouse))

const selectWarehouse = (value) => {
  emit('update:warehouse', value)
  if (value.id !== props.warehouse.id)
  emit('update:warehouseZone', null)
}
const selectWarehouseZone = (value) => emit('update:warehouseZone', value)

const getWarehouses = async (params) => (allWarehouses.value = await store.dispatch('getWarehouses', params))

onBeforeMount(() =>
  getWarehouses({
    child: true,
    warehouses: null
  })
)
</script>

<template>
  <DataInput
    :items="warehouses"
    v-model="warehouseModel"
    item-value="id"
    item-title="warehouse"
    title="Выбор хранилища"
    :is-select="true"
    @update:select="selectWarehouse" />
  <DataInput
    v-if="warehouse"
    v-model="warehouseZoneModel"
    :key="warehouseModel"
    :items="warehouseZones"
    item-value="id"
    item-title="warehouse"
    title="Выбор зоны хранилища"
    :is-select="true"
    @update:select="selectWarehouseZone" />
</template>

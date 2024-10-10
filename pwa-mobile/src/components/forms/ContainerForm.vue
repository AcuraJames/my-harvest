<script setup>
import DataInput from '@/components/elements/DataInput'
import { ref, computed, defineEmits, defineProps } from 'vue'
import { useStore } from 'vuex'
import { getDayTSBounds } from '@/utils/dates'

const store = useStore()
const props = defineProps(['vehicle', 'trailer', 'fullWeight', 'containerWeight', 'containerOnly'])
const emit = defineEmits(['update:vehicle', 'update:trailer', 'update:fullWeight', 'update:containerWeight'])

const today = new Date()

// TODO: refactor
const vehicles = ref([])
const trailers = ref([])
const currentVehicle = ref(null)
const currentTrailer = ref(null)
const containerVehicleNumber = ref('')
const containerTrailerNumber = ref('')
const containerId = ref(null)

const hasContainerWeight = ref(false)
const summaryContainerWeight = ref(0)

const netWeight = computed(() => props.fullWeight - props.containerWeight || 0)

const vehicleModel = computed(() => props.vehicle?.toUpperCase())
const trailerModel = computed(() => props.trailer?.toUpperCase())

const containerNumberValidate = (value) => {
  const pattern = /^[a-zA-Z0-9]+$/
  return !value || pattern.test(value) || 'Используйте латинские символы и цифры'
}
const minMax = (value) => !value || (value > 0 && value < 30001) || 'Минимум: 1, Максимум: 30 000'

const setContainerWeight = () => emit('update:containerWeight', summaryContainerWeight.value)

const selectContainer = (container, containerNumber, formDataNumber, items, param) => {
  const selected = items.find((item) => item[`${param}LicencePlate`] === container)
  containerId.value = selected?.id

  if (param === 'car') {
    currentVehicle.value = selected
    containerVehicleNumber.value = container
    emit('update:vehicle', container)
    emit('update:trailer', null)
    trailers.value = []
    getContainersByTrailer({
      filter: {
        carLicencePlate: currentVehicle.value?.carLicencePlate,
        uniqueTrailerLicencePlates: true
      }
    })
    getContainerLastWeight(containerVehicleNumber.value, null)
  } else {
    currentTrailer.value = selected
    containerTrailerNumber.value = container
    if (!container) emit('update:trailer', null)
    else emit('update:trailer', container)
    getContainerLastWeight(containerVehicleNumber.value, containerTrailerNumber.value)
  }

  if (selected?.weightKg && !trailerModel.value) {
    hasContainerWeight.value = true
  }
}

const selectVehicleContainer = (container) => {
  selectContainer(container, containerVehicleNumber.value, props.vehicle, vehicles.value, 'car')
}

const selectTrailerContainer = (container) => {
  selectContainer(container, containerTrailerNumber.value, props.trailer, trailers.value, 'trailer')
}

const updateVehicleNumber = (item) => {
  hasContainerWeight.value = false
  const data = item.toUpperCase()
  emit('update:vehicle', data)
  emit('update:trailer', null)
  getContainersByVehicle({
    filter: {
      carLicencePlate: data,
      uniqueLicencePlates: true
    }
  })
}

const updateTrailerNumber = (item) => {
  hasContainerWeight.value = false
  const data = item.toUpperCase()
  emit('update:trailer', data)
  getContainersByTrailer({
    filter: {
      carLicencePlate: vehicleModel.value,
      trailerLicencePlate: data,
      uniqueTrailerLicencePlates: true
    }
  })
}

const focusAutocomplete = () => {
  getContainersByVehicle({
    filter: {
      uniqueLicencePlates: true
    }
  })
}

const getContainersByVehicle = async (params) => {
  const result = (await store.dispatch('getContainers', params)) || []
  if (result?.length) vehicles.value = result
}

const getContainersByTrailer = async (params) => {
  const result = (await store.dispatch('getContainers', params)) || []
  if (result?.length) trailers.value = [...new Map(result.map((item) => [item['weightKg'], item])).values()]
}

const getContainerLastWeight = async (vehicle, trailer) => {
  const result = await store.dispatch('getContainerLastWeight', {
    filter: {
      carLicencePlate: vehicle,
      trailerLicencePlate: trailer || null,
      ...getDayTSBounds(today.valueOf() / 1000)
    }
  })
  if (!result.success) {
    hasContainerWeight.value = false
    emit('update:containerWeight', null)
  } else {
    emit('update:containerWeight', result.data)
    summaryContainerWeight.value = result.data
  }
}
</script>

<template>
  <DataInput
    :model-value="vehicleModel"
    :items="vehicles"
    item-value="id"
    item-title="carLicencePlate"
    title="Машина"
    prepend-icon="truck"
    :is-autocomplete="true"
    required="true"
    error-message="Заполните поле"
    :error-messages="containerNumberValidate(vehicleModel)"
    @update:search="selectVehicleContainer"
    @update:modelValue="updateVehicleNumber"
    @autocomplete:focus="focusAutocomplete" />
  <DataInput
    v-if="vehicleModel || containerOnly"
    :model-value="trailerModel"
    :key="vehicleModel"
    :items="trailers"
    item-value="id"
    item-title="trailerLicencePlate"
    title="Телега / Прицеп"
    prepend-icon="trail"
    :is-autocomplete="true"
    :error-messages="containerNumberValidate(trailerModel)"
    @update:search="selectTrailerContainer"
    @update:modelValue="updateTrailerNumber" />
  <DataInput
    v-if="!containerOnly"
    :model-value="fullWeight"
    title="Вес с тарой"
    type="number"
    required="true"
    positive="true"
    error-message="Заполните поле"
    append-icon="kg"
    @update:modelValue="emit('update:fullWeight', $event)" />
  <DataInput
    :model-value="containerWeight"
    title="Вес тары"
    type="number"
    error-message="Заполните поле"
    :error-messages="minMax(containerWeight)"
    append-icon="kg"
    @update:modelValue="emit('update:containerWeight', $event)">
    <template #append-btn>
      <span v-if="hasContainerWeight" class="text-primary mr-4 font-weight-bold" @click="setContainerWeight">
        (Автоматически)
      </span>
    </template>
  </DataInput>
  <DataInput
    v-if="!containerOnly"
    v-model="netWeight"
    title="Чистый вес"
    description="Вычисляется автоматически"
    :error-messages="netWeight < 0 && 'Проверьте данные'"
    disabled />
</template>

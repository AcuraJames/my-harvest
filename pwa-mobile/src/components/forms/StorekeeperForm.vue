<script setup>
import DataInput from '@/components/elements/DataInput'
import { ref, computed, watch, onBeforeMount, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'

const props = defineProps(['isNew', 'netWeight', 'product', 'templates', 'specifications'])
const emit = defineEmits(['update:specifications', 'update:unit'])
const store = useStore()

const unit = ref('')
const active = ref('pc')
const focused = ref(false)
const focusId = ref(null)

const units = {
  kg: 'Килограммы',
  pc: 'Проценты'
}

const numberValues = computed(() => props.templates?.template?.specificationsNumberValues)
const numberValuesModel = computed(() => {
  if (props.isNew) {
    return numberValues.value?.map((item) => Object.assign(item, { value: 0 }))
  }
  return props.specifications
})
const totalNumberValues = computed(() => {
  const sum = numberValuesModel.value?.reduce((sum, curr) => +sum + +curr.value, 0)
  if (isUnitKg.value) return props.netWeight - sum
  return 100 - sum
})
const isUnitKg = computed(() => unit.value === units.kg)
const unitIcon = computed(() => (isUnitKg.value ? 'kg' : 'percent'))
const numberValuesAllowed = computed(() => (props.netWeight && unit.value) || !props.isNew)

const onFocus = (id) => {
  focused.value = true
  focusId.value = id
}

const switchUnit = async (val, key) => {
  if (!props.netWeight) {
    store.commit('sendError', { message: 'Чистый вес должен быть больше нуля' })
    return
  }
  unit.value = val
  active.value = units[key]
  emit('update:unit', unit.value)
}

const activeButtonStyle = (value, key) => {
  if (value === unit.value && units[key] === active.value) {
    return {
      variant: 'tonal',
      color: 'primary'
    }
  }
  return {
    variant: 'outlined',
    color: ''
  }
}

const percentOfSum = (value) => ((value / props.netWeight) * 100).toFixed(0)
const sumOfPercent = (value) => (props.netWeight * value) / 100
const calculatePercentage = (value) => (isUnitKg.value ? percentOfSum(value) : value)
const calculateValue = (value) => (isUnitKg.value ? percentOfSum(value) : sumOfPercent(value))
const convertValuesByUnit = () => {
  if (!isUnitKg.value) {
    active.value = units.pc
    numberValuesModel.value = numberValuesModel.value?.map((item) => (item.value = parseInt(percentOfSum(item.value))))
  } else {
    active.value = units.kg
    numberValuesModel.value = numberValuesModel.value?.map((item) => (item.value = parseInt(sumOfPercent(item.value))))
  }
  emit('update:unit', unit.value)
}

const selectSpecifications = (value) => {
  let specId = null
  let specName = ''
  let specValue = ''

  numberValuesModel.value.map((spec) => {
    if (spec.id !== focusId.value) return

    specId = spec.id
    specName = spec.name
    specValue = value
  })

  const specs = props.specifications || []
  const index = specs.findIndex((spec) => spec.id === specId)
  if (index !== -1) specs.splice(index, 1)

  specs.push({
    id: specId,
    name: specName,
    value: +specValue
  })
  specs.sort((a, b) => a.id - b.id)
  emit('update:specifications', specs)
}

watch(
  () => isUnitKg.value,
  () => convertValuesByUnit()
)

watch(
  () => props.product,
  () => emit('update:specifications', [])
)

onBeforeMount(() => {
  if (!props.isNew) {
    unit.value = units.pc
  }
  convertValuesByUnit()
})
</script>

<template>
  <div v-if="templates" class="spec-number-switcher my-6 text-center bg-input">
    <div class="spec-number-switcher__title">
      Для дальнейшего заполнения выберете единицы измерения (килограммы или проценты)
    </div>
    <div class="spec-number-switcher__actions">
      <v-btn
        v-for="(value, key) in units"
        :key="key"
        :variant="activeButtonStyle(value, key).variant"
        :color="activeButtonStyle(value, key).color"
        @click="switchUnit(value, key)">
        {{ value }}
      </v-btn>
    </div>
  </div>
  <div v-if="numberValuesAllowed">
    <div v-for="item in numberValuesModel" :key="item.id" class="spec-number-field">
      <div class="spec-number-field__inputs">
        <DataInput
          :items="numberValuesModel"
          v-model="item.value"
          item-value="id"
          item-title="value"
          :title="item.name"
          type="number"
          placeholder="0"
          :append-icon="unitIcon"
          required="true"
          error-message="Заполните поле"
          :class="['spec-number-field__input', { 'spec-number-field__input--collapsed': focused }]"
          @update:focus="onFocus(item.id)"
          @update:modelValue="selectSpecifications" />
        <DataInput
          v-if="focused"
          :placeholder="calculateValue(item.value)"
          disabled
          :append-icon="isUnitKg ? 'percent' : 'kg'"
          class="spec-number-field__converted pt-6" />
      </div>
      <div v-if="focused">
        <v-progress-linear :model-value="calculatePercentage(item.value)" rounded height="12" color="primary" />
      </div>
    </div>
    <DataInput
      v-if="templates"
      v-model="totalNumberValues"
      title="Итог"
      description="Вычесляется автоматически"
      :append-icon="unitIcon"
      disabled
      :error-messages="totalNumberValues < 0 && 'Проверьте данные'" />
  </div>
</template>

<style lang="scss" scoped>
.spec-number-switcher {
  border-radius: 12px;
  padding: 12px 20px;

  &__title {
    color: #3d3d3d;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    line-height: normal;
    padding: 0 30px;
  }

  &__actions {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 12px;

    & > * {
      min-width: 129px;
    }

    .v-btn {
      height: 34px !important;
      font-size: 13px !important;
      font-weight: 400 !important;

      &.v-btn--variant-outlined {
        border: 1px solid #909090 !important;
        color: #909090 !important;
      }

      &.v-btn--variant-tonal {
        background-color: #0075d7 !important;
        color: #fff !important;
      }
    }
  }
}
.spec-number-field {
  margin-bottom: 12px;

  &__inputs {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__input {
    width: 100%;
  }

  &__input--collapsed,
  &__converted {
    width: 50%;
  }
}
</style>

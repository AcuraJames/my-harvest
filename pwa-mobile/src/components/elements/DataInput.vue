<script setup>
import { defineProps, defineEmits, computed, reactive } from 'vue'

const props = defineProps([
  'modelValue',
  'items',
  'title',
  'description',
  'disabled',
  'type',
  'label',
  'placeholder',
  'prependIcon',
  'appendIcon',
  'isAutocomplete',
  'isSelect',
  'itemValue',
  'itemTitle',
  'required',
  'positive',
  'latin',
  'maxDecimalDigits',
  'errorMessage',
  'errorMessages'
])
const emit = defineEmits(['update:modelValue', 'update:select', 'update:focus', 'autocomplete:focus'])

const rules = reactive({
  required: (value) => !!value || props.errorMessage,
  positive: (value) => parseInt(value) >= 0 || 'Введите положительное число',
  latin: (value) => {
    const pattern = /^[a-zA-Z0-9]+$/
    return pattern.test(value) || 'Используйте латинские символы и цифры'
  },
  maxDecimalDigits: (value) => {
    const number = value.split('.')
    const integer = number[0]
    const decimal = number[1]
    if (!decimal) return
    return (integer > -1 && decimal.length < 3) || 'Неверный формат'
  }
})

const computedRules = computed(() => {
  const rulesToUse = []
  if (props.required) rulesToUse.push(rules.required)
  if (props.positive) rulesToUse.push(rules.positive)
  if (props.latin) rulesToUse.push(rules.latin)
  if (props.maxDecimalDigits) rulesToUse.push(rules.maxDecimalDigits)
  return rulesToUse
})

const updateSelect = (value) => emit('update:select', value)
const updateSearch = (value) => emit('update:search', value)
</script>

<template>
  <div class="data-input">
    <div class="data-input__title">{{ title }}</div>
    <div v-if="description" class="data-input__description">{{ description }}</div>
    <div class="data-input__row">
      <div v-if="prependIcon" class="data-input__icon">
        <div class="data-input__prepend-icon">
          <v-icon>{{ `$${prependIcon}` }}</v-icon>
        </div>
      </div>
      <div class="data-input__field">
        <v-select
          v-if="isSelect"
          :value="modelValue"
          :items="items"
          :item-value="itemValue"
          :item-title="itemTitle"
          :label="label"
          :placeholder="placeholder"
          :rules="computedRules"
          variant="outlined"
          color="primary"
          menu-icon="$chevron"
          return-object
          @update:modelValue="updateSelect" />
        <v-combobox
          v-else-if="isAutocomplete"
          :value="modelValue"
          :items="items"
          :item-value="itemValue"
          :item-title="itemTitle"
          :placeholder="placeholder"
          :rules="computedRules"
          :error-messages="errorMessages"
          color="primary"
          variant="outlined"
          menu-icon="$chevron"
          hide-no-data
          return-object
          @update:search="updateSearch"
          @input="$emit('update:modelValue', $event.target.value)"
          @update:focused="$emit('autocomplete:focus')">
        </v-combobox>
        <v-text-field
          v-else
          :value="modelValue"
          :placeholder="placeholder"
          variant="outlined"
          :type="type"
          :disabled="disabled"
          :rules="computedRules"
          :error-messages="errorMessages"
          :append-inner-icon="appendIcon ? `$${appendIcon}` : ''"
          @focus="$emit('update:focus')"
          @input="$emit('update:modelValue', $event.target.value)">
          <template v-slot:append-inner>
            <slot name="append-btn" />
          </template>
        </v-text-field>
      </div>
    </div>
  </div>
</template>

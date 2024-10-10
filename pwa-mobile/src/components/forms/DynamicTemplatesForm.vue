<script setup>
import DataInput from '@/components/elements/DataInput'
import { defineProps, defineEmits, ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps(['isNew', 'culture', 'product', 'templates', 'specifications', 'rootField', 'childField'])
const emit = defineEmits([
  'update:culture',
  'update:product',
  'update:templates',
  'update:specifications',
  'update:rootField',
  'update:childField'
])

const cultures = ref(null)
const products = ref(null)
const fields = ref(null)

const formattedCultures = computed(() => cultures.value?.children)
const formattedProducts = computed(() => products.value?.children)
const formattedTemplates = computed(() => props.templates?.template?.specificationsTextLists)
const rootFields = computed(() => fields.value?.children?.filter((child) => !child.parentId))
const childFields = computed(() => fields.value?.children?.filter((child) => child.parentId === props.rootField?.id))

const cultureModel = computed(() => (props.isNew ? props.culture : props.culture?.culture))
const productModel = computed(() => (props.isNew ? props.product : props.product?.culture))
const rootFieldModel = computed(() => (props.isNew ? props.rootField : props.rootField?.field))
const childFieldModel = computed(() => (props.isNew ? props.childField : props.childField?.field))

const hasSpecifications = computed(
  () => !props.isNew && props.specifications.length === formattedTemplates.value.length
)

const selectCulture = (culture) => {
  emit('update:culture', culture)
  getProducts(culture.id)
}

const selectProduct = (product) => {
  emit('update:templates', product.id)
  emit('update:product', product)
  if (product?.id !== props.product?.id) {
    emit('update:specifications', [])
  }
}

const selectSpecifications = (value) => {
  let specId = null
  let specName = ''
  let specTextList = []

  props.templates?.template.specificationsTextLists.map((template) => {
    template.textLists.map((textList) => {
      if (textList.id === value.id) {
        specId = template.id
        specName = template.name
        specTextList = template.textLists
      }
    })
  })

  const specs = props.specifications
  const index = specs.findIndex((spec) => spec.specificationId === specId)
  if (index !== -1) specs.splice(index, 1)

  specs.push({
    specificationId: specId,
    name: specName,
    valueId: value.id,
    value: value.value,
    textList: specTextList
  })

  specs.sort((a, b) => a.specificationId - b.specificationId)

  emit('update:specifications', specs)
}

const selectRootField = (field) => {
  emit('update:rootField', field)
  if (field.id !== props.rootField.id)
  emit('update:childField', null)
}
const selectChildField = (field) => emit('update:childField', field)

const getCultures = async (params) => (cultures.value = await store.dispatch('getCultures', params))
const getProducts = async (cultureId) => (products.value = await store.dispatch('getCultures', { cultureId }))
const getFields = async (params) => (fields.value = await store.dispatch('getFields', params))

onBeforeMount(() => {
  getCultures({ child: false, cultureId: null })
  getFields({ child: true, cultureId: null })

  if (props.culture !== null) {
    emit('update:templates', props.product?.id)
    emit('update:culture', props.culture)
    getProducts(props.culture.id)
  }
})
</script>

<template>
  <DataInput
    :model-value="cultureModel"
    :items="formattedCultures"
    item-value="id"
    item-title="culture"
    title="Тип культуры"
    required="true"
    error-message="Заполните поле"
    :is-select="true"
    @update:select="selectCulture" />
  <DataInput
    v-if="products || !isNew"
    v-model="productModel"
    :key="cultureModel"
    :items="formattedProducts"
    item-value="id"
    item-title="culture"
    title="Сорт"
    required="true"
    error-message="Заполните поле"
    :is-select="true"
    @update:select="selectProduct" />
  <template v-if="formattedTemplates">
    <template v-if="hasSpecifications">
      <DataInput
        v-for="item in specifications"
        :key="item.id"
        v-model="item.value"
        :items="item.textList"
        item-value="id"
        item-title="value"
        :title="item.name"
        required="true"
        error-message="Заполните поле"
        :is-select="true"
        @update:select="selectSpecifications" />
    </template>
    <template v-else>
      <DataInput
        v-for="item in formattedTemplates"
        :key="item.id"
        :items="item.textLists"
        item-value="id"
        item-title="value"
        :title="item.name"
        required="true"
        error-message="Заполните поле"
        :is-select="true"
        @update:select="selectSpecifications" />
    </template>
  </template>
  <DataInput
    v-if="rootFields"
    :model-value="rootFieldModel"
    :items="rootFields"
    item-value="id"
    item-title="field"
    title="Выбор поля"
    required="true"
    error-message="Заполните поле"
    :is-select="true"
    @update:select="selectRootField" />
  <DataInput
    v-if="rootField"
    :key="rootFieldModel"
    :model-value="childFieldModel"
    :items="childFields"
    item-value="id"
    item-title="field"
    title="Выбор участка поля"
    required="true"
    error-message="Заполните поле"
    :is-select="true"
    @update:select="selectChildField" />
</template>

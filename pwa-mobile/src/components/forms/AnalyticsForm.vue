<script setup>
import DataInput from '@/components/elements/DataInput'
import { defineProps, defineEmits, ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps(['isNew', 'harvestedArea', 'rootField', 'childField'])
const emit = defineEmits(['update:harvestedArea', 'update:rootField', 'update:childField'])

const fields = ref(null)

const rootFields = computed(() => fields.value?.children?.filter((child) => !child.parentId))
const childFields = computed(() => fields.value?.children?.filter((child) => child.parentId === props.rootField?.id))

const rootFieldModel = computed(() => (props.isNew ? props.rootField : props.rootField?.field))
const childFieldModel = computed(() => (props.isNew ? props.childField : props.childField?.field))

const selectRootField = (field) => {
  emit('update:rootField', field)
  emit('update:childField', null)
}
const selectChildField = (field) => emit('update:childField', field)

const getFields = async (params) => (fields.value = await store.dispatch('getFields', params))

onBeforeMount(() => getFields({ child: true, cultureId: null }))
</script>

<template>
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
    v-if="rootFieldModel && childFields"
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
  <DataInput
    :model-value="harvestedArea"
    title="Количество убранных гектар"
    type="number"
    placeholder="000"
    required="true"
    positive="true"
    max-decimal-digits="true"
    error-message="Заполните поле"
    append-icon="ga"
    @update:modelValue="emit('update:harvestedArea', $event)" />
</template>

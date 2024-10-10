<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps(['date', 'clearable'])
const emit = defineEmits(['reset'])

const formattedDate = computed(() => {
  const date = props.date
  return (
    new Date(date).getDate() +
    ' ' +
    new Intl.DateTimeFormat('ru-ru', { month: 'short' }).format(date) +
    ' ' +
    new Date(date).getFullYear()
  )
})

const computedFormatDate = computed(() => (props.date ? formattedDate.value : 'За все время'))
</script>

<template>
  <div class="analytics-head">
    <span class="analytics-head__title">Валовый урожай:</span>
    <span class="analytics-head__date">{{ computedFormatDate }}</span>
    <span v-if="clearable" class="analytics-head__close" @click="emit('reset')">✕</span>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/analytics-head.scss';
</style>

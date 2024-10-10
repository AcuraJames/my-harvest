<script setup>
import { defineProps, computed } from 'vue'
import { average, convertKgToTons } from '@/utils/statistics'

const props = defineProps(['netWeight', 'harvestedArea', 'isExact', 'isMain'])

const validNetWeight = computed(() => convertKgToTons(props.netWeight) || 0)
const validProductivity = computed(() => average(props.netWeight, props.harvestedArea) || 0)
const description = computed(() => (props.isExact ? 'Урожайность' : 'Средняя урожайность'))
</script>

<template>
  <div :class="['analytics-descr__row', { 'analytics-descr__row--details': !isMain }]">
    <div class="analytics-descr__col">
      <div class="analytics-descr__icon">
        <v-icon>$analyticsThreeIcon</v-icon>
      </div>
      <div class="analytics-descr__data">
        <span class="analytics-descr__title">{{ validNetWeight }} т</span>
        <span class="analytics-descr__text">Чистый вес</span>
      </div>
    </div>
    <div class="analytics-descr__col">
      <div class="analytics-descr__icon">
        <v-icon>$tractor</v-icon>
      </div>
      <div class="analytics-descr__data">
        <span class="analytics-descr__title">{{ validProductivity }} т / Га</span>
        <span class="analytics-descr__text">{{ description }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/analytics.scss';
</style>

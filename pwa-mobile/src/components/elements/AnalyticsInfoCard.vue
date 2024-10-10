<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { average, percentage, convertAcToHa, convertKgToTons } from '@/utils/statistics'
import { isToday } from '@/utils/dates'
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps([
  'title',
  'items',
  'name',
  'netWeight',
  'harvestedArea',
  'totalTons',
  'capacity',
  'isCapacity',
  'chartConfig',
  'hasYield',
  'multiplyStats',
  'dataType',
  'allowNext'
])
const emit = defineEmits(['click:open'])

const validNetWeight = computed(() => convertKgToTons(props.netWeight))
const validProductivity = computed(() =>
  !isToday() && props.harvestedArea ? average(props.netWeight, props.harvestedArea) : null
)
const validTotalTons = computed(() => convertKgToTons(props.totalTons))
const validCapacityTons = computed(() => convertKgToTons(props.capacity))
const progressPercentage = computed(() =>
  props.capacity ? `${percentage(props.totalTons, props.capacity)}%` : 'Нет данных'
)

const progressStatus = (harvested, planted) => `${convertAcToHa(harvested)} Га / ${convertAcToHa(planted)} Га`
const progressStatusPc = (harvested, planted) => percentage(convertAcToHa(harvested), convertAcToHa(planted))
const exactYield = (netWeight, area) => (area === 0 ? 'Нет данных' : `${average(netWeight, area)} т / Га`)
</script>

<template>
  <div class="analytics-info mb-4" @click="emit('click:open')">
    <div class="analytics-info__wrap">
      <div class="analytics-info__body">
        <span class="analytics-info__title">{{ title }}</span>
        <span class="analytics-info__text">
          <span v-for="item in items" :key="item.id" class="analytics-info__item">{{ item }}</span>
        </span>
      </div>
      <div>
        <div v-if="netWeight" class="analytics-info__count">
          <div class="analytics-info__count-row mb-1">
            <div class="analytics-info__icon">
              <v-icon>$analyticsThreeIcon</v-icon>
            </div>
            <div class="analytics-info__count-descr">{{ validNetWeight }} т</div>
          </div>
          <span class="analytics-info__count-text">Чистый вес</span>
        </div>
        <div v-if="hasYield" class="analytics-info__count">
          <div class="analytics-info__count-row mb-1">
            <div class="analytics-info__icon">
              <v-icon>$tractor</v-icon>
            </div>
            <div v-if="validProductivity" class="analytics-info__count-descr">{{ validProductivity }} т / Га</div>
            <v-icon v-else>$clock</v-icon>
          </div>
          <span class="analytics-info__count-text">Ср. урожайность</span>
        </div>
      </div>
      <button v-if="allowNext" type="button" class="analytics-info__btn">
        <v-icon color="dark-grey">$arrowRight</v-icon>
      </button>
    </div>
    <template v-if="isCapacity">
      <v-divider />
      <template v-if="multiplyStats">
        <div v-for="(stat, index) in multiplyStats" :key="stat.id" class="analytics-info-capacity--multiply">
          <v-divider v-if="index !== 0" />
          <div class="analytics-info-capacity__head" />
          <div class="analytics-info-capacity__name">{{ stat.value }}</div>
          <div class="analytics-info-capacity__data">
            <span class="analytics-info-capacity__head-text">Статус уборки:</span>
            <span class="analytics-info-capacity__title">
              {{ progressStatus(stat.harvestedAreaAc, stat.plantedAreaAcAccumulated) }}
            </span>
            <span class="analytics-info-capacity__title">
              {{ progressStatusPc(stat.harvestedAreaAc, stat.plantedAreaAcAccumulated) }}%
            </span>
          </div>
          <div class="analytics-info-capacity__progress-row">
            <div class="analytics-info-capacity__progress">
              <v-progress-linear
                :model-value="progressStatusPc(stat.harvestedAreaAc, stat.plantedAreaAcAccumulated)"
                rounded
                height="12"
                color="primary" />
            </div>
          </div>
          <div class="analytics-info-capacity__extra">
            <div class="analytics-info-capacity__extra-item">
              <div class="analytics-info__icon">
                <v-icon>$analyticsThreeIcon</v-icon>
              </div>
              <span class="analytics-info__count-text">Чистый вес: </span>
              <div class="analytics-info__count-descr">{{ stat.netWeightStorekeeperKg / 1000 }} т</div>
            </div>
            <div class="analytics-info-capacity__extra-item">
              <div class="analytics-info__icon">
                <v-icon>$tractor</v-icon>
              </div>
              <span class="analytics-info__count-text">Урожайность: </span>
              <div v-if="exactYield" class="analytics-info__count-descr">
                {{ exactYield(stat.netWeightStorekeeperKg, stat.harvestedAreaAc) }}
              </div>
              <v-icon v-else>$clock</v-icon>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="analytics-info-capacity">
        <div class="analytics-info-capacity__head">
          <!--          <span class="analytics-info-capacity__head-text">Статус уборки:</span>-->
        </div>
        <div class="analytics-info-capacity__name">{{ name }}</div>
        <div class="analytics-info-capacity__data">
          <span v-if="dataType === 'fields'" class="analytics-info-capacity__title">{{
            progressStatus(totalTons, capacity)
          }}</span>
          <span v-if="dataType === 'warehouses'" class="analytics-info-capacity__title">{{ validTotalTons }} т / {{ validCapacityTons }} т</span>
          <span class="analytics-info-capacity__title">{{ progressPercentage }}</span>
        </div>
        <div class="analytics-info-capacity__progress-row">
          <div class="analytics-info-capacity__progress">
            <v-progress-linear :model-value="progressPercentage" rounded height="12" color="primary" />
          </div>
        </div>
      </div>
    </template>
    <div v-if="chartConfig">
      <Bar :data="chartConfig.data" :options="chartConfig.options" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/analytics-info-card.scss';
</style>

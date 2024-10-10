<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { formatTimestamp } from '@/utils/dates'

const props = defineProps(['data'])
const emit = defineEmits(['click:open'])

const formattedDate = computed(() =>
  formatTimestamp(props.data?.updatedAt, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
)

const grossWeight = computed(() => (props.data?.netWeightKg + props.data?.container?.weightKg) / 1000)

</script>
<template>
  <div v-if="data" class="history-card mb-4" @click="emit('click:open', data.id)">
    <div class="history-card__wrap">
      <div class="history-card__body">
        <div class="history-card__item">
          <span class="history-card__item-title">Машины: </span>
          <div>
            <div class="history-card__item-icon"><v-icon color="dark-grey">$truck</v-icon></div>
            <span class="history-card__item-value">{{ data.container?.carLicencePlate }}</span>
          </div>
          <div v-if="data.container?.trailerLicencePlate">
            <div class="history-card__item-icon"><v-icon color="dark-grey">$trail</v-icon></div>
            <span class="history-card__item-value">{{ data.container?.trailerLicencePlate }}</span>
          </div>
        </div>
        <div class="history-card__item">
          <span class="history-card__item-title">Продукция: </span>
          <span class="history-card__item-value">{{ data.culture?.culture }}</span>
        </div>
        <div class="history-card__item">
          <span class="history-card__item-title">Масса Брутто: </span>
          <span class="history-card__item-value">{{ grossWeight }} т</span>
        </div>
      </div>
      <div>
        <button type="button" class="history-card__btn">
          <v-icon color="dark-grey">$arrowRight</v-icon>
        </button>
      </div>
      <div class="history-card__date">{{ formattedDate }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/history-card.scss';
</style>

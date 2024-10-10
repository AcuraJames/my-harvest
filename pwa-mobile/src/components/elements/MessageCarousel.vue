<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatTimestamp, isToday, isYesterday } from '@/utils/dates'

const props = defineProps(['items'])
const emit = defineEmits(['update:status', 'update:items'])

const formattedDate = (date) => {
  return `${formatTimestamp(date, { hour: '2-digit', minute: '2-digit' })} ${
    isToday(date * 1000)
      ? 'сегодня'
      : isYesterday(date * 1000)
      ? 'вчера'
      : formatTimestamp(date, { day: '2-digit', month: 'short' })
  }`
}

const updateStatus = (index) => {
  const msg = props.items[index]
  emit('update:items', index)
  if (msg) emit('update:status', msg.id)
}
</script>

<template>
  <section class="slider-section mb-4">
    <v-carousel
      v-if="items"
      :show-arrows="false"
      height="auto"
      color="grey"
      hide-delimiter-background
      @update:modelValue="updateStatus">
      <v-carousel-item v-for="item in items" :key="item.id">
        <div class="mb-12">
          <v-card :color="item.isRead ? 'white' : 'primary'" height="auto" class="ma-2 card">
            <v-card-text>
              <div class="card__head">
                <div class="card__head-body">
                  <p class="card__title">{{ item.sender?.lastName }} {{ item.sender?.firstName }}</p>
                  <p class="card__position">{{ item.sender?.position }}</p>
                </div>
                <button type="button" class="card__close">
                  <v-icon>$close</v-icon>
                </button>
              </div>
              <p class="card__text">{{ item.message }}</p>
              <p class="card__date">{{ formattedDate(item.updatedAt) }}</p>
            </v-card-text>
          </v-card>
        </div>
      </v-carousel-item>
    </v-carousel>
  </section>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  //box-shadow: 0 0 8px 0 rgba(35, 33, 118, 0.22) !important;

  &__title {
    font-size: 16px;
    font-weight: 600;
  }
  &__position {
    font-size: 11px;
    font-weight: 600;
  }
  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
  }
  &__text {
    margin-top: 4px;
    font-size: 16px;
    font-weight: 500;
    word-break: break-all;
  }
  &__date {
    margin-top: 8px;
    text-align: right;
  }
}
</style>

<script setup>
import { defineProps, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps(['role'])

const route = useRoute()
const router = useRouter()

const navs = reactive([
  {
    name: 'Главная',
    icon: '$footerHome',
    route: 'home',
    roles: ['Weigher', 'Storekeeper']
  },
  {
    name: 'Урожай',
    icon: '$footerHarvest',
    route: 'harvest',
    roles: ['Weigher', 'Storekeeper']
  },
  {
    name: 'Тара',
    icon: '$footerTare',
    route: 'container',
    roles: ['Weigher']
  },
  {
    name: 'Аналитика',
    icon: '$footerAnalytics',
    route: 'analytics',
    roles: ['Manager']
  },
  {
    name: 'Ввести Га',
    icon: '$footerAdd',
    route: 'addHectares',
    roles: ['Manager']
  },
  {
    name: 'История',
    icon: '$footerHistory',
    route: 'history',
    roles: ['Weigher', 'Storekeeper']
  },
  {
    name: 'Сообщения',
    icon: '$footerMessenger',
    route: 'messenger',
    roles: ['Manager']
  }
])
</script>

<template>
  <v-bottom-navigation :elevation="20" bg-color="footer-bg">
    <template v-for="nav in navs" :key="nav.name">
      <v-btn
        v-if="nav.roles?.includes(role)"
        :class="{ active: nav.name === route.meta?.navTitle }"
        @click="router.push({ name: nav.route })">
        <v-icon>{{ nav.icon }}</v-icon>
        {{ nav.name }}
      </v-btn>
    </template>
  </v-bottom-navigation>
</template>

<style scoped lang="scss">
.v-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin: 0 0 4px 0;
}
.active {
  color: #0075d7;
}
</style>

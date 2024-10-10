import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { removeFromStorage } from '@/utils/common'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      navTitle: 'Главная'
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/AuthView.vue')
  },
  {
    path: '/harvest',
    name: 'harvest',
    component: () => import('@/views/HarvestView'),
    meta: {
      title: 'Взвесить урожай',
      navTitle: 'Урожай'
    }
  },
  {
    path: '/harvest/check',
    name: 'harvest-check',
    component: () => import('@/views/HarvestCheckView'),
    meta: {
      title: 'Проверка'
    }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/HistoryView'),
    meta: {
      title: 'История',
      navTitle: 'История'
    }
  },
  {
    path: '/history/:id',
    name: 'history-details',
    component: () => import('@/views/HistoryDetails'),
    meta: {
      title: 'Карточка истории'
    }
  },
  {
    path: '/components',
    name: 'components',
    component: () => import('@/views/Components'),
    meta: {
      title: 'Компоненты'
    }
  },
  {
    path: '/container',
    name: 'container',
    component: () => import('@/views/ContainerView'),
    meta: {
      title: 'Взвесить тару',
      navTitle: 'Тара'
    }
  },
  {
    path: '/container/check',
    name: 'container-check',
    component: () => import('@/views/ContainerCheckView'),
    meta: {
      title: 'Проверка'
    }
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('@/views/AnalyticsView'),
    meta: {
      title: 'Аналитика',
      navTitle: 'Аналитика'
    }
  },
  {
    path: '/analytics/:slug',
    name: 'analytics-details',
    component: () => import('@/views/AnalyticsDetails')
  },
  {
    path: '/analytics/:slug/:id',
    name: 'product-details',
    component: () => import('@/views/ProductDetails')
  },
  {
    path: '/add',
    name: 'addHectares',
    component: () => import('@/views/AddHectaresView'),
    meta: {
      title: 'Добавить показатели',
      navTitle: 'Ввести Га'
    }
  },
  {
    path: '/add/check',
    name: 'hectares-check',
    component: () => import('@/views/AddHectaresCheckView'),
    meta: {
      title: 'Проверка'
    }
  },
  {
    path: '/messenger',
    name: 'messenger',
    component: () => import('@/views/AnalyticsMessenger'),
    meta: {
      title: 'Написать сообщение',
      navTitle: 'Сообщения'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  if (to.name !== 'harvest-check' && from.name !== 'harvest-check') {
    removeFromStorage('form-data')
  }
  if (to.name !== 'container-check' && from.name !== 'container-check') {
    removeFromStorage('container-form-data')
  }
  if (to.name !== 'hectares-check' && from.name !== 'hectares-check') {
    removeFromStorage('analytics-form-data')
  }
})

export default router

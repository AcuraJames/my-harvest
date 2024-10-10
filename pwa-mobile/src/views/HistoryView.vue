<script setup>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import AppLoader from '@/components/AppLoader'
import HistoryCard from '@/components/elements/HistoryCard'
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getRole, getStorage, setStorage } from '@/utils/common'

const store = useStore()
const router = useRouter()
const role = getRole()

const harvests = ref(null)
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(harvests.value?.totalCount / 10))

const goToDetails = (id) => router.push({ name: 'history-details', params: { id } })
const changePage = (page) => {
  setStorage('history-current-page', page)
  updateHarvestList(page)
}

const getHarvestList = async (params) => (harvests.value = await store.dispatch(`get${role}HarvestsHistory`, params))
const updateHarvestList = (page) => {
  getHarvestList({
    filter: {
      onlyOwn: false,
      startTime: null,
      finishTime: null
    },
    pagination: {
      pageNumber: page,
      pageSize: 10
    }
  })
}

onBeforeMount(() => {
  currentPage.value = +getStorage('history-current-page') || 1
  updateHarvestList(currentPage.value)
})
</script>

<template>
  <AppHeader />
  <AppLoader v-if="!harvests" />
  <template v-else>
    <HistoryCard v-for="item in harvests?.harvests" :key="item.id" :data="item" @click:open="goToDetails" />
  </template>
  <div class="text-center px-4">
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="6"
      size="x-small"
      active-color="primary"
      @update:modelValue="changePage($event)" />
  </div>
  <AppFooter :role="role" />
</template>

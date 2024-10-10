<script setup>
import { onBeforeMount, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getStorage } from '@/utils/common'
import { ServiceWorker } from '@/utils/workers'
import appVersion from 'raw-loader!/public/VERSION'

const store = useStore()
const router = useRouter()
const tokens = getStorage('tokens')

const version = ref(null)

const getVersion = async () => {
  const response = await fetch('/VERSION', {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'public, max-age=0',
      'Content-Type': 'text/plain;charset=UTF-8'
    }
  })

  return await response.text()
}

const getVersionWithTimer = () => {
  const delay = 60 * 1000
  setInterval(async () => (version.value = await getVersion()), delay)
}

const setTokens = () => (tokens ? store.commit('setTokens', JSON.parse(tokens)) : '')

watch(
  () => version.value,
  () => {
    if (version.value !== appVersion) {
      ServiceWorker.clearCache()
      router.go(0)
    }
  }
)

onBeforeMount(() => {
  setTokens()
  getVersionWithTimer()
})
</script>

<template>
  <v-app>
    <v-main class="mt-14 mx-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
#app {
  font-family: 'Gilroy', sans-serif;
}
</style>

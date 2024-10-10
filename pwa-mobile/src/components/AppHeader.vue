<script setup>
import { defineProps, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { removeFromStorage } from '@/utils/common'

defineProps(['noBack', 'title'])

const store = useStore()
const route = useRoute()
const router = useRouter()

const dialog = ref(false)

const logout = async () => {
  Object.keys(localStorage).forEach((key) => removeFromStorage(key))
  await store.dispatch('logout')
  router.push({ name: 'auth' })
}
</script>

<template>
  <v-app-bar color="white" height="24" class="pa-4">
    <v-container>
      <v-row class="align-center flex-0-1">
        <div class="header-prepend">
          <slot name="prepend"><v-icon v-if="!noBack" @click="router.back()">$chevronBack</v-icon></slot>
        </div>
        <div class="header-content">
          <slot name="content">{{ title ? title : route.meta?.title }}</slot>
        </div>
        <div class="header-append">
          <slot name="append">
            <v-icon v-if="noBack" color="black" @click="dialog = true">$logout</v-icon>
          </slot>
        </div>
      </v-row>
    </v-container>
  </v-app-bar>

  <v-dialog v-model="dialog" width="auto">
    <v-card class="pa-6">
      <v-card-text class="px-0 pt-4 font-weight-bold">Вы действительно хотите выйти из аккаунта?</v-card-text>
      <v-card-actions class="mt-6 text-right">
        <v-spacer />
        <v-btn color="primary" size="md" @click="dialog = false">Отмена</v-btn>
        <v-btn color="error" size="md" @click="logout">Выйти</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.header-prepend {
  position: absolute;
  left: 0;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-append {
  position: absolute;
  right: 0;
}
</style>

<script setup>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import AppLogo from '@/components/AppLogo'
import { onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const user = ref()

const getUser = async () => (user.value = await store.dispatch('getUser'))

onBeforeMount(() => getUser())
</script>

<template>
  <AppHeader>
    <template #content>
      <AppLogo />
    </template>
  </AppHeader>

  <section class="dialog-section mb-4">
    <div class="text-center">
      <v-dialog v-model="dialog" width="auto">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
        </template>

        <v-card>
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </section>

  <AppFooter />
</template>

<script>
export default {
  data() {
    return {
      dialog: false
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/harvest.scss';
</style>

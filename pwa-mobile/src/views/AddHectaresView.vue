<script setup>
import AppHeader from '@/components/AppHeader'
import AnalyticsForm from '@/components/forms/AnalyticsForm'
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getStorage, setStorage } from '@/utils/common'

const store = useStore()
const router = useRouter()

const isNew = ref(false)

const formData = reactive({
  rootField: null,
  childField: null,
  harvestedArea: null
})

const isDisabled = computed(() => Object.keys(formData).some((field) => formData.harvestedArea < 0 || !formData[field]))

const error = computed(() => store.getters.isError || {})

const closeSnackbar = async () => await store.commit('sendError', null)

const saveFormData = () => setStorage('analytics-form-data', JSON.stringify(formData))

const checkData = () => {
  saveFormData()
  router.push({ name: 'hectares-check' })
}

onBeforeMount(() => {
  const savedData = getStorage('analytics-form-data')
  if (savedData) {
    Object.assign(formData, JSON.parse(savedData))
    isNew.value = false
  }
})
</script>

<template>
  <AppHeader />
  <AnalyticsForm
    :root-field="formData.rootField"
    :child-field="formData.childField"
    :harvested-area="formData.harvestedArea"
    @update:rootField="formData.rootField = $event"
    @update:childField="formData.childField = $event"
    @update:harvestedArea="formData.harvestedArea = $event" />
  <div class="footer-btn">
    <v-btn :disabled="isDisabled" color="primary" class="w-100" @click="checkData">Отправить показатели</v-btn>
  </div>
  <v-snackbar v-model="error.message" :key="error" :timeout="5000" color="error">
    {{ error.message }}
    <template v-slot:actions>
      <v-btn variant="text" density="compact" @click="closeSnackbar">✖</v-btn>
    </template>
  </v-snackbar>
</template>

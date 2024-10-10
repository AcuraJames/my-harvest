<script setup>
import AppHeader from '@/components/AppHeader.vue'
import ContainerForm from '@/components/forms/ContainerForm.vue'
import PhotoForm from '@/components/forms/PhotoForm.vue'
import { computed, onBeforeMount, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getStorage, setStorage } from '@/utils/common'

const store = useStore()
const router = useRouter()

const formData = reactive({
  vehicle: null,
  trailer: null,
  containerWeight: null,
  photos: []
})
const isLoading = ref(false)

const excludedFields = ['trailer']

const fieldsToCheck = computed(() => Object.keys(formData).filter((field) => !excludedFields.includes(field)))
const isDisabled = computed(
  () =>
    formData.containerWeight < 1 ||
    formData.containerWeight > 30000 ||
    fieldsToCheck.value.some((field) => !formData[field])
)
const vehicleNumber = computed(() => formData.vehicle?.toUpperCase())
const trailerNumber = computed(() => formData.trailer?.toUpperCase())

const error = computed(() => store.getters.isError || {})

const setLoadingState = (value) => (isLoading.value = value)

const saveFormData = () => setStorage('container-form-data', JSON.stringify(formData))

const checkData = () => {
  saveFormData()
  router.push({ name: 'container-check' })
}

onBeforeMount(() => {
  const savedData = getStorage('container-form-data')
  if (savedData) {
    Object.assign(formData, JSON.parse(savedData))
  }
})
</script>

<template>
  <AppHeader />
  <div class="pb-12 mb-16" style="min-height: 800px">
    <ContainerForm
      :container-only="true"
      :vehicle="vehicleNumber"
      :trailer="trailerNumber"
      :full-weight="formData.fullWeight"
      :container-weight="formData.containerWeight"
      @update:vehicle="formData.vehicle = $event"
      @update:trailer="formData.trailer = $event"
      @update:containerWeight="formData.containerWeight = $event" />
    <v-divider />
    <PhotoForm :photos="formData.photos" @loading="setLoadingState" @update:photos="formData.photos = $event" />
  </div>
  <div class="footer-btn">
    <v-btn :disabled="isDisabled" :loading="isLoading" color="primary" class="w-100" @click="checkData">Далее</v-btn>
  </div>
  <v-snackbar v-model="error.message" :timeout="5000" color="error">
    {{ error.message }}
    <template v-slot:actions>
      <v-btn variant="text" density="compact" @click="error = null">✖</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import AppHeader from '@/components/AppHeader'
import ContainerForm from '@/components/forms/ContainerForm'
import DynamicTemplatesForm from '@/components/forms/DynamicTemplatesForm'
import StorageForm from '@/components/forms/StorageForm'
import PhotoForm from '@/components/forms/PhotoForm.vue'
import { ref, onBeforeMount, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getStorage, setStorage } from '@/utils/common'
import { roles } from '@/constants/roles'

const store = useStore()
const router = useRouter()

const role = ref(null)
const isNew = ref(true)
const isLoading = ref(false)

const formData = reactive({
  vehicle: null,
  trailer: null,
  fullWeight: null,
  containerWeight: null,
  culture: null,
  product: null,
  rootField: null,
  childField: null,
  warehouse: null,
  warehouseZone: null,
  specificationsTextLists: [],
  photos: []
})
const templates = ref(null)

const excludedFields = {
  Storekeeper: ['trailer'],
  Weigher: ['trailer', 'warehouse', 'warehouseZone']
}

const error = computed(() => store.getters.isError || {})

const dynamicFieldsToCheck = computed(() => [...formData.specificationsTextLists])
const templatesArrayLength = computed(() => templates.value?.template?.specificationsTextLists?.length || 0)

const fieldsToCheck = computed(() =>
  Object.keys(formData).filter((field) => !excludedFields[role.value].includes(field))
)
const isDisabled = computed(
  () =>
    formData.containerWeight < 1 ||
    formData.containerWeight > 30000 ||
    fieldsToCheck.value.some((field) => !formData[field]) ||
    dynamicFieldsToCheck.value.length !== templatesArrayLength.value
)

const vehicleNumber = computed(() => formData.vehicle?.toUpperCase())
const trailerNumber = computed(() => formData.trailer?.toUpperCase())

const closeSnackbar = async () => await store.commit('sendError', null)

const setLoadingState = (value) => (isLoading.value = value)

const saveFormData = () => setStorage('form-data', JSON.stringify(formData))

const checkData = () => {
  saveFormData()
  router.push({ name: 'harvest-check' })
}

const getHarvestsTemplate = async (cultureId) =>
  (templates.value = await store.dispatch(`get${role.value}HarvestsTemplate`, { cultureId }))

onBeforeMount(() => {
  const user = JSON.parse(getStorage('user'))
  role.value = roles[user?.roleId]

  const savedData = getStorage('form-data')
  if (savedData) {
    Object.assign(formData, JSON.parse(savedData))
    isNew.value = false
  }
})
</script>

<template>
  <AppHeader />
  <div class="pb-12 mb-16">
    <ContainerForm
      :vehicle="vehicleNumber"
      :trailer="trailerNumber"
      :full-weight="formData.fullWeight"
      :container-weight="formData.containerWeight"
      @update:vehicle="formData.vehicle = $event"
      @update:trailer="formData.trailer = $event"
      @update:fullWeight="formData.fullWeight = $event"
      @update:containerWeight="formData.containerWeight = $event" />
    <v-divider />
    <DynamicTemplatesForm
      :is-new="isNew"
      :culture="formData.culture"
      :product="formData.product"
      :root-field="formData.rootField"
      :child-field="formData.childField"
      :specifications="formData.specificationsTextLists"
      :templates="templates"
      @update:culture="formData.culture = $event"
      @update:product="formData.product = $event"
      @update:rootField="formData.rootField = $event"
      @update:childField="formData.childField = $event"
      @update:specifications="formData.specificationsTextLists = $event"
      @update:templates="getHarvestsTemplate" />
    <v-divider />
    <StorageForm
      v-if="role === 'Storekeeper'"
      :is-new="isNew"
      :warehouse="formData.warehouse"
      :warehouse-zone="formData.warehouseZone"
      @update:warehouse="formData.warehouse = $event"
      @update:warehouseZone="formData.warehouseZone = $event" />
    <v-divider />
    <PhotoForm :photos="formData.photos" @loading="setLoadingState" @update:photos="formData.photos = $event" />
    <div class="footer-btn">
      <v-btn :disabled="isDisabled" :loading="isLoading" color="primary" class="w-100" @click="checkData">Далее</v-btn>
    </div>
  </div>
  <v-snackbar v-model="error.message" :key="error" :timeout="5000" color="error">
    {{ error.message }}
    <template v-slot:actions>
      <v-btn variant="text" density="compact" @click="closeSnackbar">✖</v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped lang="scss">
@import '@/assets/scss/harvest.scss';
</style>

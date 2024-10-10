<script setup>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import AppLogo from '@/components/AppLogo'
import AppLoader from '@/components/AppLoader'
import MessageCarousel from '@/components/elements/MessageCarousel'
import { computed, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { setStorage } from '@/utils/common'
import { getDayTSBounds } from '@/utils/dates'
import { roles } from '@/constants/roles'
import appVersion from 'raw-loader!/public/VERSION'

const store = useStore()
const router = useRouter()

const user = ref(null)
const role = ref(null)
const stats = ref(null)
const today = new Date()
const messages = ref([])
const receivedMessageLength = ref(0)
const totalMessageCount = ref(0)
const currentMessagePage = ref(1)
const isInit = ref(true)
const isLoading = ref(false)
const success = ref({})

const totalDailyTons = computed(() => stats.value?.harvestsStats?.reduce((sum, curr) => sum + curr.sumKg, 0))

const convertKgToTon = (weight) => weight / 1000

const getUser = async () => {
  user.value = await store.dispatch('getUser')
  role.value = await roles[user.value?.roleId]
  setStorage('user', JSON.stringify(user.value))

  if (role.value === roles[201]) router.push({ name: 'analytics' })
}
const getStats = async (params) => (stats.value = await store.dispatch(`get${role.value}Statistics`, params))

const getAllMessages = async (params) => {
  isLoading.value = true
  const response = await store.dispatch('getMessages', params)
  if (response.notifications) {
    const filteredMessages = response.notifications.filter((item) => item.roleIds.includes(user.value?.roleId))
    messages.value.push(...filteredMessages)
    receivedMessageLength.value += filteredMessages.length
    totalMessageCount.value = response.totalCount
    isLoading.value = false
  }
}
const updateMessageList = (index) => {
  if (index === 0 && !isInit.value) {
    currentMessagePage.value += 1
    for (let i = 0; i <= 10; i++) {
      messages.value.shift()
    }
    getAllMessages({
      pagination: {
        pageNumber: currentMessagePage.value
      }
    })
    if (receivedMessageLength.value === totalMessageCount.value) {
      currentMessagePage.value = 1
      receivedMessageLength.value = 0
      getAllMessages({
        pagination: {
          pageNumber: currentMessagePage.value
        }
      })
    }
  } else isInit.value = false
}
const updateStatus = async (notificationId) => await store.dispatch('updateMessageStatus', { notificationId })

onBeforeMount(async () => {
  success.value = store.getters.isSuccess
  await getUser()
  await getAllMessages({
    pagination: {
      pageNumber: currentMessagePage.value
    }
  })
  await getStats({
    filter: {
      ...getDayTSBounds(today.valueOf() / 1000),
      onlyOwn: false
    }
  })
})
</script>

<template>
  <AppHeader no-back="true">
    <template #content>
      <AppLogo />
    </template>
  </AppHeader>
  <AppLoader v-if="!stats" />
  <template v-else>
    <v-progress-circular v-if="isLoading" indeterminate color="primary" class="w-100 mb-4" />
    <MessageCarousel :items="messages" @update:status="updateStatus" @update:items="updateMessageList" />
    <section class="info-section mb-4">
      <div class="info-blocks">
        <div class="info-blocks__row">
          <div class="info-blocks__col">
            <div class="info">
              <div class="info__wrap">
                <div class="info__head">
                  <span class="info__count">{{ convertKgToTon(totalDailyTons) || 0 }}</span>
                  <div class="info__icon">
                    <v-icon>$infoOneIcon</v-icon>
                  </div>
                </div>
                <span class="info__text">Тонны за сегодня</span>
              </div>
            </div>
          </div>
          <div class="info-blocks__col">
            <div class="info">
              <div class="info__wrap">
                <div class="info__head">
                  <span class="info__count">{{ stats?.totalCars }}</span>
                  <div class="info__icon">
                    <v-icon>$infoTwoIcon</v-icon>
                  </div>
                </div>
                <span class="info__text">Машин за сегодня</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="infographic-section mb-4">
      <div class="infographic">
        <div class="infographic__wrap pa-3">
          <div class="infographic__head mb-4">
            <div class="infographic__head-descr">
              <span class="infographic__head-title">Инфографика на сегодня</span>
              <span class="infographic__head-text">Показатели веса за месяц</span>
            </div>
            <!--          <button type="button" class="infographic__head-btn">-->
            <!--            <v-icon>$arrowRight</v-icon>-->
            <!--          </button>-->
          </div>

          <div class="infographic__body">
            <div v-for="stat in stats?.harvestsStats" :key="stat.culture.id" class="progress mb-4">
              <div class="progress__head">
                <span class="progress__count">{{ convertKgToTon(stat.sumKg) }} т</span>
                <span class="progress__name">{{ stat.culture.culture }}</span>
              </div>
              <!--            <div class="progress__bar">-->
              <!--              <v-progress-linear color="primary" :model-value="stat.sumKg" />-->
              <!--            </div>-->
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  <div class="app-version text-light-grey">{{ appVersion }}</div>

  <v-snackbar v-model="success.success" timeout="2000" color="success">
    {{ success.message }}
  </v-snackbar>
  <AppFooter :role="role" />
</template>

<style scoped lang="scss">
@import '@/assets/scss/home.scss';
</style>

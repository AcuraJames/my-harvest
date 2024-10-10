<script setup>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import AppLoader from '@/components/AppLoader'
import { ref, reactive, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatTimestamp } from '@/utils/dates'

const store = useStore()

const message = ref('')
const messages = ref([])
const messenger = ref(null)
const recipients = reactive([
  { label: 'Написать весовщикам', value: 203 },
  { label: 'Написать складовщикам', value: 202 }
])
const selectedRecipient = ref([])
const showRecipient = ref(false)
const isAll = ref(true)
const isInit = ref(false)
const isLoading = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)

const recipientText = (ids) => {
  if (!ids) return
  return ids.length > 1 ? 'всем' : ids[0] === 203 ? 'весовщикам' : 'складовщикам'
}

const onIntersect = (entry) => {
  if (entry && isInit.value) {
    isLoading.value = true
    currentPage.value += 1
    getAllMessages({ pagination: { pageNumber: currentPage.value } })
  }
}

const sendMessage = async () => {
  try {
    await store.dispatch('sendMessage', {
      notification: {
        message: message.value,
        roleIds: isAll.value ? [202, 203] : selectedRecipient.value
      }
    })
    messages.value.unshift({
      message: message.value,
      roleIds: selectedRecipient.value,
      updatedAt: new Date()
    })
    message.value = ''
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  } catch (err) {
    console.log(err)
  }
}
const getAllMessages = async (params) => {
  const response = await store.dispatch('getMessages', params)
  if (response.notifications) {
    messages.value.push(...response.notifications)
    totalCount.value = response.totalCount
  }
  isLoading.value = false
  setTimeout(() => (isInit.value = true), 2000)
}

onBeforeMount(() => getAllMessages({ pagination: { pageNumber: currentPage.value } }))

onMounted(() => {
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }, 1000)
})
</script>

<template>
  <AppHeader>
    <template #append>
      <v-icon @click="showRecipient = !showRecipient">$gear</v-icon>
    </template>
  </AppHeader>
  <AppLoader v-if="!messages.length" />
  <template v-else>
    <div v-if="showRecipient" class="analytics-messenger-settings">
      <v-checkbox v-model="isAll" label="Написать всем" hide-details @update:modelValue="selectedRecipient = []" />
      <v-divider />
      <template v-for="(recipient, index) in recipients" :key="index">
        <v-checkbox
          v-model="selectedRecipient"
          :label="recipient.label"
          :value="recipient.value"
          hide-details
          @update:modelValue="isAll = false" />
      </template>
    </div>
    <div
      class="analytics-messenger"
      :style="{ backgroundImage: 'url(' + require('/public/img/bg/messenger-bg.png') + ')' }">
      <div v-intersect="{ handler: onIntersect, once: true, options: { threshold: 1.0 } }" class="intersection">
        <v-progress-circular v-if="isLoading" indeterminate color="primary" />
      </div>
      <div ref="messenger" class="analytics-messenger__messages">
        <div v-for="(message, index) in messages" :key="index" class="analytics-messenger__message-box">
          <div class="analytics-messenger__recipient">Сообщение {{ recipientText(message?.roleIds) }}</div>
          <div class="analytics-messenger__message-text">{{ message?.message }}</div>
          <div class="analytics-messenger__message-date">
            {{
              formatTimestamp(message?.updatedAt, {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: 'short'
              })
            }}
          </div>
        </div>
      </div>
      <div class="analytics-messenger__input">
        <v-textarea
          v-model="message"
          variant="outlined"
          placeholder="Введите текст"
          density="compact"
          hide-details
          rows="1"
          max-rows="5"
          auto-grow="true" />
        <v-btn icon="$send" elevation="0" @click="sendMessage" />
      </div>
    </div>
  </template>
  <AppFooter role="Manager" />
</template>

<style lang="scss" scoped>
.intersection {
  width: 100%;
  height: 10px;
  padding-top: 50px;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.analytics-messenger-settings {
  position: fixed;
  top: 45px;
  right: 16px;
  z-index: 1007;
  padding: 24px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 7px 0 rgba(108, 98, 137, 0.23);
}
.analytics-messenger {
  width: 100vw;
  height: calc(100% + 24px);
  margin-inline: -16px;
  margin-top: -24px;
  background-repeat: repeat;
  position: relative;

  &__messages {
    margin-right: 16px;
    margin-bottom: 80px;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    overflow-y: scroll;
  }

  &__message-box {
    max-width: 280px;
    min-height: 80px;
    padding: 12px;
    margin-top: 8px;
    color: #ffffff;
    background-color: #0075d7;
    border-radius: 16px 1px 16px 16px;
  }

  &__recipient {
    color: #63a4d9;
    font-size: 14px;
  }

  &__message-text {
    font-size: 14px;
    word-break: break-all;
  }

  &__message-date {
    margin-top: 4px;
    font-size: 11px;
    text-align: right;
    color: #63a4d9;
  }

  &__input {
    width: 100%;
    padding: 12px 16px;
    display: flex;
    gap: 8px;
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 56px;
  }
}
</style>

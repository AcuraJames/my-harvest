<script setup>
import AppHeader from '@/components/AppHeader'
import AppLogo from '@/components/AppLogo'
import AuthForm from '@/components/auth/AuthForm'
import PasswordRecover from '@/components/auth/PasswordRecover'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import appVersion from 'raw-loader!/public/VERSION'

const router = useRouter()
const store = useStore()
const step = ref(1)
const error = ref('')

const goBack = () => (step.value -= 1)

const login = async (email, password) => {
  error.value = ''
  const res = await store.dispatch('login', { email, password })
  if (res?.success) {
    await router.push({ name: 'home' })
  } else {
    error.value = res.message
  }
}
</script>

<template>
  <AppHeader no-back="true">
    <template #prepend>
      <v-btn v-if="step > 1" :ripple="false" density="compact" icon="$arrowBack" @click="goBack" />
    </template>
    <template #content><AppLogo /></template>
  </AppHeader>
  <div class="auth text-center">
    <template v-if="step === 1">
      <div class="auth__title">Вход</div>
<!--      <div class="auth__text text-grey">В приложение Весы от Agropoisk.ru!</div>-->
      <AuthForm :error="error" @recover="step += 1" @login="login" />
    </template>
    <template v-if="step === 2">
      <div class="auth__title">Восстановление пароля</div>
      <div class="auth__text text-grey">
        Введите e-mail который Вы <br />
        использовали для регистрации, и мы <br />
        вышлем вам инструкцию
      </div>
      <PasswordRecover />
    </template>
    <div class="auth__credits text-light-grey">© 2022 Все права защищены АгроПоиск</div>
    <div class="auth__version text-light-grey">{{ appVersion }}</div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/auth.scss';
</style>

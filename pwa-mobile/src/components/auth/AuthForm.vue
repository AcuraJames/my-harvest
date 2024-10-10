<script setup>
import { ref, watch, defineEmits, defineProps, computed } from 'vue'

const emit = defineEmits(['login', 'recover'])
const props = defineProps({
  error: { default: '', type: [String] }
})

const email = ref('')
const password = ref('')

const errors = ref([])
let showPassword = ref(false)

const passwordIcon = computed(() => (showPassword.value ? '$hide' : '$show'))
const passwordType = computed(() => (showPassword.value ? 'text' : 'password'))

watch(
  () => props.error,
  () => {
    errors.value.push(props.error)
  }
)

const cleanErrors = () => (errors.value = [])

const login = () => emit('login', email.value, password.value)
const recover = () => emit('recover')
</script>

<template>
  <v-form @submit.prevent="login">
    <v-text-field
      v-model="email"
      :error-messages="errors"
      variant="outlined"
      color="primary"
      placeholder="Логин"
      class="mt-8 text-left"
      @input="cleanErrors" />
    <v-text-field
      v-model="password"
      :append-inner-icon="passwordIcon"
      :type="passwordType"
      :error-messages="errors"
      variant="outlined"
      color="primary"
      placeholder="Пароль"
      class="mb-8 text-left"
      @click:append-inner="showPassword = !showPassword"
      @input="cleanErrors" />
    <v-btn :disabled="!email.length || !password.length" type="submit" color="primary" class="w-100 mb-4">
      Войти
    </v-btn>
  </v-form>
  <v-btn variant="text" color="primary" @click="recover">Забыли пароль?</v-btn>
</template>

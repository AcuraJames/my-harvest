<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['updateContact'])

const email = ref('')
const isDisabled = ref(true)

const rules = {
  required: (value) => !!value || 'Введите e-mail',
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (pattern.test(value)) {
      isDisabled.value = false
      return
    }
    return 'E-mail введен некорректно'
  }
}

const recover = () => {
  emit('recover', email.value)
}
</script>

<template>
  <v-text-field
    v-model="email"
    :rules="[rules.required, rules.email]"
    variant="outlined"
    color="primary"
    label="Введите ваш e-mail"
    placeholder="E-mail"
    class="my-8" />
  <v-btn color="primary" :disabled="isDisabled" class="w-100 mb-4" @click="recover">Подтвердить</v-btn>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps(['photos'])
const emit = defineEmits(['update:photos', 'loading'])

const imageList = ref(props.photos)

const uploadPhoto = async (e) => {
  if (props.photos.length === 20) {
    await store.commit('sendError', { message: 'Превышен допустимый лимит файлов' })
    return
  }
  const photo = e.target.files[0]

  const formData = new FormData()
  formData.append('file', photo)

  emit('loading', true)

  const result = await store.dispatch('uploadImage', formData)

  if (!result.success) {
    await store.commit('sendError', result)
    emit('loading', false)
    return
  }

  const name =
    photo.name.length > 18
      ? photo.name.split('').splice(0, 15).join('') + '.' + photo.name.split('.').at(-1)
      : photo.name

  imageList.value = [...props.photos, { url: result.data.url, name }]
  emit('update:photos', imageList.value)
  emit('loading', false)
  e.target.value = ''
}

const deletePhoto = (index) => {
  imageList.value.splice(index, 1)
  emit('update:photos', imageList.value)
}
</script>

<template>
  <div class="photo-form">
    <div class="photo-form__title">Фото документа</div>
    <div class="photo-form__description">
      <span>До 20 файлов</span>
      <span>{{ photos?.length }} из 20</span>
    </div>
    <div class="photo-form__list">
      <div v-for="(photo, index) in photos" :key="index" class="photo-form__list-item">
        <span class="photo-form__item-img">
          <v-icon>$imgDummy</v-icon>
          <!--          <img :src="`https://api.storage.agropoisk.info${photo.url}`" alt="" width="32" height="32">-->
        </span>
        <span class="photo-form__item-name">{{ photo.name }}</span>
        <span class="photo-form__item-trash"><v-icon @click="deletePhoto(index)">$trash</v-icon></span>
      </div>
    </div>
    <div class="photo-form__file-input">
      <label>
        <input type="file" accept="image/jpeg, image/png" @change="uploadPhoto" />
        <v-icon color="grey" size="64">$camera</v-icon>
        <span class="photo-form__label">
          Нажмите, чтобы добавить <br />
          фотографию
        </span>
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.photo-form {
  &__title {
    color: #1b1c1e;
    font-size: 24px;
    font-weight: 800;
    line-height: 1;
    padding: 12px 0;
  }

  &__description {
    display: flex;
    justify-content: space-between;
    color: var(--v-theme-grey);
    font-size: 18px;
    font-weight: 800;

    & > * {
      color: #909090;
    }
  }
  &__list-item {
    width: 100%;
    height: 48px;
    padding: 8px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    border: 1px solid #909090;
    border-radius: 12px;
  }

  &__item-img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d9d9d9;
    border-radius: 50%;
  }

  &__item-name {
    font-size: 18px;
    font-weight: 600;
  }

  &__item-trash {
    margin-left: auto;
  }

  &__label {
    color: #3d3d3d;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 135%;
  }

  &__file-input {
    width: 100%;
    height: 90px;
    margin-top: 16px;
    position: relative;
    border: 2px solid #909090;
    border-radius: 12px;

    input {
      display: none;
    }

    label {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      text-align: center;
      position: absolute;
      top: 0;
      left: 16px;
      right: 16px;

      i {
        margin-right: 24px;
      }
    }
  }
}
</style>

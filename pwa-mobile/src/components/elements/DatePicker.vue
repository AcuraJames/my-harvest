<script setup>
import { computed, reactive, ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps(['timestamp'])
const emit = defineEmits(['update:timestamp', 'applyDate', 'close'])

const getMonthsForLocale = (locale) => {
  const format = new Intl.DateTimeFormat(locale, { month: 'long' })
  const months = []
  for (let month = 0; month < 12; month++) {
    const testDate = new Date(Date.UTC(2000, month, 1, 0, 0, 0))
    months.push(format.format(testDate))
  }
  return months
}

const daysInMonth = (month, year) =>
  Array.from({ length: new Date(year, month + 1, 0).getDate() }, (item, index) => index + 1)

const months = getMonthsForLocale('ru-ru')

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const currentDay = ref()
const offsetMondayStyle = ref()
const offsetSundayStyle = ref()

currentDay.value = props?.timestamp ? new Date(props.timestamp) : new Date()

const currentMonth = computed(() => months[currentDate.month])
const currentYear = computed(() => currentDay.value.getFullYear())

const days = computed(() => daysInMonth(currentDate.month, currentDate.year))

const isCurrentMonth = computed(() => currentDate.month === today.month)

const currentMonthName = computed(() => currentMonth.value.charAt(0).toUpperCase() + currentMonth.value.slice(1))

const offsetWeekdayStyles = (day) => {
  if (day === 1) {
    return offsetMondayStyle.value
  } else if (day === days.value[days.value.length - 1]) {
    return offsetSundayStyle.value
  }
  return {}
}

const selectDay = (day) => {
  if (currentDate.month === today.month && day > today.day) return
  currentDate.day = day
}

const prevMonth = () => (currentDate.month -= 1)
const nextMonth = () => (currentDate.month += 1)

const today = reactive({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate()
})

const currentDate = reactive({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate()
})

watch(
  currentDate,
  (date) => {
    emit(
      'update:timestamp',
      Math.round(new Date(Date.UTC(Number(date.year), Number(date.month), Number(date.day))).getTime())
    )
    const firstDayOfMonth = new Date(Date.UTC(Number(date.year), Number(date.month), 1))
    const lastDayOfMonth = new Date(Date.UTC(Number(date.year), Number(date.month) + 1, 0))
    const lastWeekDaysCount = 7 - lastDayOfMonth.getDay()

    offsetMondayStyle.value = { marginLeft: `${(firstDayOfMonth.getDay() - 1) * 14}%` }
    offsetSundayStyle.value = { marginRight: `${(lastWeekDaysCount - 1) * 14}%` }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="calendar">
    <div class="calendar__month">
      <v-icon color="grey" @click="prevMonth">$chevronBack</v-icon>
      <span class="calendar__month--current">{{ currentMonthName }} {{ currentYear }}</span>
      <v-icon v-if="!isCurrentMonth" style="transform: rotate(180deg)" @click="nextMonth">$chevronBack</v-icon>
    </div>
    <div class="calendar__weekdays">
      <span v-for="day in weekDays" :key="day" class="calendar-day">{{ day }}</span>
    </div>
    <div class="calendar__days">
      <span
        class="calendar__day-wrap"
        v-for="day in days"
        :key="day"
        :style="offsetWeekdayStyles(day)"
        @click="selectDay(day)">
        <span
          class="calendar__day"
          :class="{
            'calendar__day--active': day === currentDate.day,
            'calendar__day--disabled': currentDate.month === today.month && day > today.day
          }">
          {{ day }}
        </span>
      </span>
    </div>
    <div class="calendar__actions">
      <v-btn variant="outlined" size="md" color="error" class="w-50" @click="emit('close')">Отмена</v-btn>
      <v-btn variant="outlined" size="md" color="primary" class="w-50" @click="emit('applyDate')">Выбрать</v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calendar {
  display: flex;
  flex-direction: column;
  position: relative;
  //font-size: 1rem;
  background: #ffffff;
  border-radius: 15px;
  filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.1));
  padding: 16px;
  margin-inline: 16px;

  &__weekdays {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    padding-bottom: 1.5rem;
    font-weight: 600;
    color: #8e8c9a;
  }

  &__month {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding-bottom: 16px;
    color: #909090;
  }

  &__month--current {
    font-size: 21px;
    color: #232426;
  }

  &__month--prev {
    transform: rotate(90deg);
  }

  &__month--next {
    transform: rotate(-90deg);
  }

  &__days {
    display: flex;
    flex-flow: row wrap;
  }

  &__day-wrap {
    color: #3d3d3d;
    height: 3rem;
    flex: 1 0 14%;
  }

  &__day {
    display: flex;
    width: auto;
    height: 100%;
    font-size: 1.25rem;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }

  &__day--active {
    width: 50px;
    background: #0075d7;
    border-radius: 50%;
    color: #ffffff;
  }

  &__day--disabled {
    color: #a5a5a5;
    pointer-events: none;
  }

  &__actions {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}
</style>

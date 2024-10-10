export const getDayTSBounds = (timestamp) => {
  const newDate = new Date(timestamp * 1000)

  return {
    startTime: Math.floor(newDate.setUTCHours(0, 0, 0) / 1000),
    finishTime: Math.floor(newDate.setUTCHours(23, 59, 59) / 1000)
  }
}

export const isToday = (timestamp) => {
  const date = new Date(timestamp)
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}
export const isYesterday = (timestamp) => {
  const date = new Date(timestamp)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

export const formatTimestamp = (timestamp, options = {}) => {
  const date = new Date(timestamp * 1000)

  return new Intl.DateTimeFormat('ru-RU', options).format(date)
}

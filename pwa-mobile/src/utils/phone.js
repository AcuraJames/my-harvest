export const formatInputNumber = (e) => {
  let phone = e.target.value

  if (phone.length !== e.target.selectionStart) {
    return phone
  }

  phone = phone.replace(/\D/g, '')

  if (!phone) return ''

  const countryCode = '+7'
  let formattedPhone = ''

  if (phone[0] === '9') {
    phone = countryCode + phone
  }
  if (phone[0] === '7' || phone[0] === '8') {
    formattedPhone = countryCode + ' '
  }

  if (phone.length > 1) {
    formattedPhone += '(' + phone.substring(1, 4)
  }
  if (phone.length >= 5) {
    formattedPhone += ') ' + phone.substring(4, 7)
  }
  if (phone.length >= 8) {
    formattedPhone += '-' + phone.substring(7, 9)
  }
  if (phone.length >= 10) {
    formattedPhone += '-' + phone.substring(9, 11)
  }

  return formattedPhone
}

export const formatStringNumber = (phone) => {
  if (!phone) return
  const parts = phone.toString().match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
  console.log(parts)
  return `+${parts[1]} (${parts[2]}) ${parts[3]}-${parts[3]}-${parts[5]}`
}

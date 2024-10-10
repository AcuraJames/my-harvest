const baseData = '1234567890abcdefghijklmnopqrstuvwxyz'

function generateRandomStr(length) {
  let result = ''

  while (result.length < length) {
    result += baseData[Math.floor(Math.random() * baseData.length)]
  }

  return result
}

function generateOnePlusTwo(symbol) {
  const twoRandomSymbols = generateRandomStr(2)
  return symbol + twoRandomSymbols
}

export const generateRequestId = () => {
  const prefix = generateRandomStr(4),
    firstElPlusRandom = generateOnePlusTwo(prefix[0]),
    secondElPlusRandom = generateOnePlusTwo(prefix[1]),
    thirdElPlusRandom = generateOnePlusTwo(prefix[2]),
    fourthElPlusRandom = generateOnePlusTwo(prefix[3]),
    otherStr = generateRandomStr(48)

  return prefix + firstElPlusRandom + secondElPlusRandom + thirdElPlusRandom + fourthElPlusRandom + otherStr
}

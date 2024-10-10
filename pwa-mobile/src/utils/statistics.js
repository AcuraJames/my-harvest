export const reduceObject = (prop) => (acc, curr) => acc + curr[prop]

export const convertKgToTons = (weight) => Number((weight / 1000).toFixed(2))
export const convertAcToHa = (area) => Number((area / 100).toFixed(2))

export const average = (weight, area) => {
  const result = area ? convertKgToTons(weight) / convertAcToHa(area) : null
  return !isNaN(result) ? Number(result?.toFixed(2)) : null
}

export const percentage = (a, b) => Number(((a / b) * 100).toFixed(2))

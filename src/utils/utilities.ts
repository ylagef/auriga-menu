export const formatPrice = (price: number | string) => {
  let auxPrice = String(price).replace('.', ',').replaceAll(' ', '')

  if (!auxPrice.includes('€')) {
    auxPrice += '€'
  }

  return auxPrice
}

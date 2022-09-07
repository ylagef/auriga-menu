import { ALLERGENS } from '../types'
import { useState } from 'react'

export interface Props {
  allergen: ALLERGENS
  text: string
}

export function Allergen({ allergen, text }: Props) {
  const [allergenOpen, setAllergenOpen] = useState<ALLERGENS>(null)

  return (
    <div
      className="flex items-center overflow-x-hidden"
      onClick={() => {
        setAllergenOpen(allergenOpen === allergen ? null : allergen)
      }}
    >
      <img className="h-6" src={`/assets/images/allergens/${allergen}.png`} alt={allergen} />
      <small className={`${allergenOpen === allergen ? 'w-screen px-2' : 'w-0'} transition-all max-w-fit`}>{text}</small>
    </div>
  )
}

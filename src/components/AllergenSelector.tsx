import { useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'

import type { ALLERGENS } from '../types'

export interface Props {
  allergen: ALLERGENS
  onClick: () => void
  isSelected: boolean
}

export default function AllergenSelector({ allergen, onClick, isSelected }: Props): JSX.Element {
  return (
    <div className="flex flex-col justify-center items-center pointer" onClick={onClick}>
      <img
        className={`h-12 ${!isSelected ? 'opacity-40' : ''}`}
        src={`/assets/images/allergens/${allergen}.png`}
        alt={translations.allergens[allergen]}
      />
      <small className="pt-2 text-xs">{translations.allergens[allergen]}</small>
    </div>
  )
}

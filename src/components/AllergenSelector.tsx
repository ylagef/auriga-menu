import { translations } from 'src/locales/translations'

import type { ALLERGENS } from '../types'

export interface Props {
  allergen: ALLERGENS
  onClick: () => void
  isSelected: boolean
}

export default function AllergenSelector({ allergen, onClick, isSelected }: Props) {
  return (
    <div className="flex flex-col justify-center items-center pointer" onClick={onClick} title={translations.allergens[allergen]}>
      <img
        className={`transition-opacity h-12 opacity-${!isSelected ? '40' : '100'}`}
        src={`/assets/images/allergens/${allergen}.png`}
        alt={translations.allergens[allergen]}
      />
    </div>
  )
}

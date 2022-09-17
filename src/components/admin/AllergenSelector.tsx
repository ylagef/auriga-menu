import { translations } from 'src/locales/translations'

import type { ALLERGENS } from '.@components/admintypes'

export interface Props {
  allergen: ALLERGENS
  onClick: () => void
  isSelected: boolean
}

export default function AllergenSelector({ allergen, onClick, isSelected }: Props) {
  return (
    <div className="flex flex-col justify-center items-center pointer" onClick={onClick} title={translations.allergens[allergen]}>
      <img
        className={`transition-all h-12 ${isSelected ? 'opacity-100 drop-shadow-allergen' : 'opacity-40'}`}
        src={`/assets/images/allergens/${allergen}.png`}
        alt={translations.allergens[allergen]}
      />
    </div>
  )
}

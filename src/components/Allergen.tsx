import { ALLERGENS } from '../types'
import { useState, useEffect } from 'react'

export interface Props {
  allergen: ALLERGENS
  text: string
}

export function Allergen({ allergen, text }: Props) {
  const [allergenOpen, setAllergenOpen] = useState<ALLERGENS>(null)

  useEffect(() => {
    if (!allergenOpen) return

    const timeout = setTimeout(() => {
      setAllergenOpen(null)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [allergenOpen])
  return (
    <div
      className="flex items-center overflow-x-hidden"
      onClick={() => {
        setAllergenOpen((prev) => (prev === allergen ? null : allergen))
      }}
    >
      <img className="h-6" src={`/assets/images/allergens/${allergen}.png`} alt={allergen} />
      <small className={`${allergenOpen === allergen ? 'w-screen pl-2' : 'w-0'} transition-all max-w-fit`}>{text}</small>
    </div>
  )
}

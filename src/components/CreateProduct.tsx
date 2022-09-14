import React, { FormEvent, useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'
import { ALLERGENS, CATEGORY_TYPES, CategorySI, EXTRA_SERVICES, ProductSI, SCHEDULES, ZoneSI } from 'src/typesSupabase'
import { createCategory, createCategoryProduct, createZone, getZones } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import Allergen from './Allergen'
import AllergenSelector from './AllergenSelector'
import { Input } from './Input'
import LineCard from './LineCard'

export default function CreateProduct({ category, products }: { category: CategorySI; products: ProductSI[] }) {
  const [loading, setLoading] = useState(false)
  const [allergens, setAllergens] = useState<ALLERGENS[]>([])
  const [options, setOptions] = useState<string[]>([])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string

    const parsedOptions = options.map((_, index) => formData.get('option-' + index) as string)

    const order = products.sort((a, b) => a.order - b.order).pop()?.order + 1 || 0

    const newProduct: ProductSI = { name, description, price, options: parsedOptions, allergens, order }

    await createCategoryProduct({ categoryId: category.id, newProduct })
    window.location.reload()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Input id="name" type="text" label="Nombre" placeholder="Nombre" />
      <Input id="description" type="text" label="Descripción" placeholder="Descripción" />
      <Input id="price" type="text" label="Precio" placeholder="Precio" />

      <LineCard label="Opciones">
        {options.map((option, index) => (
          <Input key={`option-${index}`} id={`option-${index}`} type="text" placeholder={`Opción ${index + 1}`} />
        ))}
        <button
          type="button"
          onClick={() => {
            setOptions((prev) => [...prev, ''])
          }}
        >
          {options.length === 0 ? 'Añadir opciones' : 'Añadir otra opción'}
        </button>
      </LineCard>

      <LineCard label="Alérgenos">
        <div className="flex flex-wrap justify-center gap-4 max-w-md">
          {Object.values(ALLERGENS).map((allergen) => (
            <AllergenSelector
              key={allergen}
              allergen={allergen}
              isSelected={allergens.includes(allergen)}
              onClick={() => {
                setAllergens(allergens.includes(allergen) ? allergens.filter((a) => a !== allergen) : [...allergens, allergen])
              }}
            />
          ))}
        </div>
      </LineCard>

      <button type="submit" className="w-full bg-dark-text py-2 px-4 rounded text-light-text disabled:opacity-60" disabled={loading}>
        Crear
      </button>
    </form>
  )
}

import { FormEvent, useState } from 'react'
import TrashIcon from 'src/icons/TrashIcon'
import { ALLERGENS, CategorySI, ProductSI } from 'src/typesSupabase'
import { createCategoryProduct } from 'src/utils/supabase'

import AllergenSelector from './AllergenSelector'
import Button, { BUTTON_TYPES } from './Button'
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
      <Input id="name" type="text" label="Nombre" placeholder="Nombre" required />
      <Input id="description" type="text" label="Descripción" placeholder="Descripción" required />
      <Input id="price" type="text" label="Precio" placeholder="Precio" required />

      <LineCard label="Opciones">
        {options.length > 0 && (
          <div className="flex flex-col">
            {options.map((option, index) => (
              <div className="flex gap-2 items-center ml-8" key={`option-${index}`}>
                <Input id={`option-${index}`} type="text" placeholder={`Opción ${index + 1}`} defaultValue={option} required />
                {index === options.length - 1 && (
                  <button
                    onClick={() => {
                      // remove last option
                      setOptions((prev) => prev.slice(0, -1))
                    }}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <Button
          inverted
          onClick={() => {
            setOptions((prev) => [...prev, ''])
          }}
        >
          {options.length === 0 ? 'Añadir opciones' : 'Añadir otra opción'}
        </Button>
      </LineCard>

      <LineCard label="Alérgenos">
        <div className="flex flex-wrap justify-center gap-4 max-w-xl">
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

      <Button type={BUTTON_TYPES.SUBMIT} className="w-full" disabled={loading}>
        Crear
      </Button>
    </form>
  )
}

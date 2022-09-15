import { FormEvent, useState } from 'react'
import TrashIcon from 'src/icons/TrashIcon'
import { ALLERGENS, CategorySI, ProductSI, SectionSI } from 'src/typesSupabase'
import { createCategoryProduct, createSectionProduct, deleteProductById, updateProduct } from 'src/utils/supabase'

import AllergenSelector from './AllergenSelector'
import Button, { BUTTON_TYPES } from './Button'
import { Input } from './Input'
import LineCard from './LineCard'

export default function ProductForm({
  category,
  section,
  product,
  products,
  defaultOpen
}: {
  category?: CategorySI
  section?: SectionSI
  product?: ProductSI
  products?: ProductSI[]
  defaultOpen?: boolean
}) {
  const updateMode = !!product
  const [loading, setLoading] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const [allergens, setAllergens] = useState<ALLERGENS[]>(product?.allergens || [])
  const [options, setOptions] = useState<string[]>(product?.options || [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string

    const parsedOptions = options.map((_, index) => formData.get('option-' + index) as string)

    const productsArray = products || section.products || []
    const order = productsArray.sort((a, b) => a.order - b.order).pop()?.order + 1 || 0

    const productObj: ProductSI = { name, description, price, options: parsedOptions, allergens, order }

    console.log({ productObj })

    if (updateMode) {
      productObj.id = product.id
      await updateProduct({ productObj })
    }
    if (category) await createCategoryProduct({ categoryId: category.id, productObj })
    if (section) await createSectionProduct({ sectionId: section.id, productObj })

    window.location.reload()
  }

  const deleteProduct = async () => {
    await deleteProductById({ productId: product.id })
    window.history.back()
  }

  if (!open)
    return (
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Abrir editor
      </Button>
    )

  return (
    <div className="flex flex-col gap-10">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Input id="name" type="text" label="Nombre" placeholder="Nombre" required defaultValue={product?.name} />
        <Input id="description" type="text" label="Descripción" placeholder="Descripción" defaultValue={product?.description} />
        <Input id="price" type="text" label="Precio" placeholder="Precio" required defaultValue={product?.price} />

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
          {updateMode ? 'Editar' : 'Crear'}
        </Button>
      </form>

      {updateMode &&
        (!confirmDeletion ? (
          <button
            className="text-red-700 font-semibold"
            onClick={() => {
              setConfirmDeletion(true)
            }}
          >
            ELIMINAR PRODUCTO
          </button>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <span>¿Seguro que quieres eliminar este producto?</span>
            <span>
              Se eliminará de <strong>todas las secciones y/o categorías</strong>.
            </span>
            <Button className="w-full bg-red-700" onClick={deleteProduct}>
              Confirmar eliminación
            </Button>
          </div>
        ))}
    </div>
  )
}

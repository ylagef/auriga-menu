import AllergenSelector from '@components/admin/AllergenSelector'
import Button, { BUTTON_TYPES } from '@components/admin/Button'
import Error from '@components/admin/Error'
import Info from '@components/admin/Info'
import { Input } from '@components/admin/Input'
import LineCard from '@components/admin/LineCard'
import { FormEvent, useEffect, useState } from 'react'
import TrashIcon from 'src/icons/TrashIcon'
import { ALLERGENS, CategorySI, ProductSI, SectionSI } from 'src/types'
import { createCategoryProduct, createSectionProduct, deleteProductById, updateProduct } from 'src/utils/supabase'
import { formatPrice } from 'src/utils/utilities'

export default function ProductForm({
  category,
  section,
  product,
  defaultOpen
}: {
  category?: CategorySI
  section?: SectionSI
  product?: ProductSI
  defaultOpen?: boolean
}) {
  const updateMode = !!product
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>(null)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const [allergens, setAllergens] = useState<ALLERGENS[]>(product?.allergens || [])
  const [options, setOptions] = useState<string[]>(product?.options || [])
  const [customValueEnabled, setCustomValueEnabled] = useState(product?.customPrice || false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const order = formData.get('order') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    const price = formatPrice(formData.get('price') as string)

    const parsedOptions = options.map((_, index) => formData.get('option-' + index) as string)

    const productObj: ProductSI = {
      name,
      description,
      price,
      options: parsedOptions,
      allergens,
      order: Number(order),
      customPrice: customValueEnabled
    }

    try {
      if (updateMode) {
        productObj.id = product.id
        await updateProduct({ productObj })
      } else {
        if (category) await createCategoryProduct({ categoryId: category.id, productObj })
        if (section) await createSectionProduct({ sectionId: section.id, productObj })
      }

      window.location.reload()
    } catch (e) {
      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  const deleteProduct = async () => {
    try {
      setLoading(true)
      await deleteProductById({ productId: product.id })
      window.history.back()
    } catch (e) {
      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  const getDefaultPrice = () => (product?.price ? product.price.replace('€', '').replace(',', '.').trim() : '')
  const getDefaultOrder = () => (product?.order ? (product.order > 0 ? String(product.order) : '1') : '1')

  const handleCustomValueEnabled = (val: boolean) => {
    setCustomValueEnabled(val)
  }

  useEffect(() => {
    setLoading(false)
  }, [error])

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
      <Info>
        {category && (
          <span>
            Este producto se {updateMode ? 'actualizará en' : 'añadirá a'} la categoría actual: <strong>{category.categoryTitle}</strong>.
          </span>
        )}
        {section && (
          <span>
            Este producto se {updateMode ? 'actualizará en' : 'añadirá a'} la sección actual: <strong>{section.title}</strong>.
          </span>
        )}
        <span>El orden será de menor a mayor.</span>
      </Info>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Input id="order" type="number" label="Orden" required defaultValue={getDefaultOrder()} steps={1} min={1} />
        <Input id="name" label="Nombre" placeholder="Costilla, Brochetas de pollo..." required defaultValue={product?.name} />
        <Input
          id="description"
          type="textarea"
          label="Descripción"
          placeholder="Con ahumados y nuestra salsa, Frito estilo nikkei..."
          defaultValue={product?.description}
        />
        <Input
          id="price"
          type="number"
          label="Precio"
          placeholder="6.50, S/M..."
          defaultValue={getDefaultPrice()}
          customValueEnabled={customValueEnabled}
          handleCustomValueEnabled={handleCustomValueEnabled}
          steps={0.01}
          min={0}
        />

        <LineCard label="Opciones">
          {options.length > 0 && (
            <div className="flex flex-col w-full gap-4">
              {options.map((option, index) => (
                <div className="flex gap-2 items-center" key={`option-${index}`}>
                  <Input
                    id={`option-${index}`}
                    label={`Opción ${index + 1}`}
                    placeholder="De jamón, De calamares..."
                    defaultValue={option}
                    required
                  />
                  {index === options.length - 1 && (
                    <button
                      className="mt-7"
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

        {error && <Error>{error}</Error>}

        <Button type={BUTTON_TYPES.SUBMIT} className="w-full" disabled={loading}>
          {updateMode ? 'Actualizar' : 'Añadir'}
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
            <Button className="w-full" onClick={deleteProduct} error disabled={loading}>
              Confirmar eliminación
            </Button>
          </div>
        ))}
    </div>
  )
}

import React, { FormEvent, useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'
import { CATEGORY_TYPES, CategorySI, EXTRA_SERVICES, SCHEDULES, ZoneSI } from 'src/typesSupabase'
import { createCategory, deleteCategoryById, getZones, updateCategory } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import Error from './admin/Error'
import Info from './admin/Info'
import Button from './Button'
import { Input } from './Input'
import LineCard from './LineCard'

export default function CategoryForm({ category, zone, defaultOpen }: { category?: CategorySI; zone?: ZoneSI; defaultOpen?: boolean }) {
  const updateMode = !!category
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>(null)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const [zones, setZones] = useState<ZoneSI[]>(null)
  const [type, setType] = useState<CATEGORY_TYPES>(category?.type)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const categoryTitle = formData.get('categoryTitle') as string
    const buttonText = formData.get('buttonText') as string

    const selectedZones = zone ? [zone.id] : zones.filter((zone) => formData.get(`zone-${zone.id}`) === 'on').map((zone) => zone.id)
    if (selectedZones.length < 1) return setError('Debes seleccionar al menos una zona.')

    const extraServices = Object.values(EXTRA_SERVICES)
      .filter((extraService) => formData.get(extraService) === 'on')
      .map((extraService) => extraService)
    const schedules = Object.values(SCHEDULES)
      .filter((schedule) => formData.get(schedule) === 'on')
      .map((schedule) => schedule)

    const slug = createSlug(categoryTitle)

    const categoryObj: CategorySI = { categoryTitle, buttonText, type, extraServices, schedules, slug }

    try {
      if (updateMode) {
        categoryObj.id = category.id
        await updateCategory({ selectedZones, categoryObj })
      } else {
        await createCategory({ selectedZones, categoryObj })
      }

      window.location.href = `/admin/categorias/${slug}`
    } catch (e) {
      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  const fetchZones = async () => {
    const data = await getZones({ restaurantId: 1 })
    setZones(data)
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectElement = event.currentTarget
    const id = selectElement.id
    const selectedValue = selectElement.value

    if (id === 'type') setType(selectedValue as CATEGORY_TYPES)
  }

  const deleteCategory = async () => {
    await deleteCategoryById({ categoryId: category.id })
    window.history.back()
  }

  useEffect(() => {
    setLoading(false)
  }, [error])

  useEffect(() => {
    if (!zone) fetchZones()
  }, [])

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
        <span>
          <strong>Título:</strong> Título dentro de la categoría.
        </span>
        <span>
          <strong>Texto del botón:</strong> Texto del botón de selección entre categorías.
        </span>
      </Info>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {!zone && (
          <LineCard label="Zona/s">
            <div className="flex flex-col gap-4 max-w-xl">
              {zones?.map((zone) => (
                <div key={zone.id} className="flex items-center gap-2">
                  <input
                    id={`zone-${zone.id}`}
                    name={`zone-${zone.id}`}
                    type="checkbox"
                    defaultChecked={!!category?.zones?.find((z) => z.zone.id === zone.id)}
                  />
                  <label htmlFor={`zone-${zone.id}`}>{zone.name}</label>
                </div>
              ))}
            </div>
          </LineCard>
        )}

        <Input id="categoryTitle" label="Título" placeholder="Los dulces, Con pan y mucha miga..." required defaultValue={category?.categoryTitle} />
        <Input id="buttonText" label="Texto del botón" placeholder="Desayunos y meriendas, Postres..." required defaultValue={category?.buttonText} />

        <LineCard label="Servicios extra">
          <div className="flex flex-col gap-4 max-w-xl">
            {Object.values(EXTRA_SERVICES).map((extraService) => (
              <div key={extraService} className="flex items-center gap-2">
                <input id={extraService} name={extraService} type="checkbox" defaultChecked={category?.extraServices?.includes(extraService)} />
                <label htmlFor={extraService}>{translations.extraServices[extraService]}</label>
              </div>
            ))}
          </div>
        </LineCard>

        <LineCard label="Horarios">
          <div className="flex flex-col gap-4 max-w-xl">
            {Object.values(SCHEDULES).map((schedule) => (
              <div key={schedule} className="flex items-center gap-2">
                <input id={schedule} name={schedule} type="checkbox" defaultChecked={category?.schedules?.includes(schedule)} />
                <label htmlFor={schedule}>{translations.schedules[schedule]}</label>
              </div>
            ))}
          </div>
        </LineCard>

        <LineCard label="Tipo *">
          <select
            id="type"
            className="border-b-dark-text py-2 px-4 rounded"
            defaultValue={category?.type || ''}
            onChange={handleSelectChange}
            required
            disabled={updateMode}
          >
            <option disabled value="">
              Selecciona tipo
            </option>
            {Object.values(CATEGORY_TYPES).map((type) => (
              <option key={type} value={type}>
                {translations.categoryTypes[type]}
              </option>
            ))}
          </select>

          {updateMode && <small>El tipo no puede ser editado</small>}

          <ul className="text-sm">
            <li>
              <span className="font-semibold">Menú</span>
              <div className="pl-4">
                Menú del día con platos. <span className="italic">(ej. Entrantes, Primeros...)</span>
              </div>
            </li>
            <li>
              <span className="font-semibold">Secciones</span>
              <div className="pl-4">
                Secciones con sus productos. <span className="italic">(ej. Clásicas, Del Auriga...)</span>
              </div>
            </li>
            <li>
              <span className="font-semibold">Productos</span>
              <div className="pl-4">Listado de productos sin división por secciones.</div>
            </li>
          </ul>
        </LineCard>

        {error && <Error>{error}</Error>}

        <button type="submit" className="w-full bg-dark-text py-2 px-4 rounded text-light-text disabled:opacity-60" disabled={loading}>
          {updateMode ? 'Actualizar' : 'Añadir'}
        </button>
      </form>

      {updateMode &&
        (!confirmDeletion ? (
          <button
            className="text-red-700 font-semibold"
            onClick={() => {
              setConfirmDeletion(true)
            }}
          >
            ELIMINAR CATEGORÍA
          </button>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <span>¿Seguro que quieres eliminar esta categoría?</span>
            <span>
              Se eliminarán también <strong>todas sus secciones, productos</strong>...
            </span>
            <Button className="w-full bg-red-700" onClick={deleteCategory}>
              Confirmar eliminación
            </Button>
          </div>
        ))}
    </div>
  )
}

import React, { FormEvent, useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'
import { CATEGORY_TYPES, CategorySI, EXTRA_SERVICES, SCHEDULES, ZoneSI } from 'src/typesSupabase'
import { createCategory, getZones } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import { Input } from './Input'
import LineCard from './LineCard'

export default function CategoryForm({ category }: { category?: CategorySI }) {
  const editMode = !!category
  const [loading, setLoading] = useState(false)
  const [zones, setZones] = useState<ZoneSI[]>(null)
  const [type, setType] = useState<CATEGORY_TYPES>(category?.type)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const categoryTitle = formData.get('categoryTitle') as string
    const buttonText = formData.get('buttonText') as string

    const selectedZones = zones.filter((zone) => formData.get(`zone-${zone.id}`) === 'on').map((zone) => zone.id)
    const extraServices = Object.values(EXTRA_SERVICES)
      .filter((extraService) => formData.get(extraService) === 'on')
      .map((extraService) => extraService)
    const schedules = Object.values(SCHEDULES)
      .filter((schedule) => formData.get(schedule) === 'on')
      .map((schedule) => schedule)

    const slug = createSlug(categoryTitle)

    const categoryObj: CategorySI = { categoryTitle, buttonText, type, extraServices, schedules, slug }

    if (editMode) {
      // TODO change to edit
      await createCategory({ selectedZones, newCategory: categoryObj })
    } else {
      await createCategory({ selectedZones, newCategory: categoryObj })
    }

    window.location.reload()
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

  useEffect(() => {
    fetchZones()
  }, [])

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <LineCard label="Zona/s">
        <div className="flex flex-col gap-4 max-w-xl">
          {zones?.map((zone) => (
            <div key={zone.id} className="flex items-center gap-2">
              <input
                id={`zone-${zone.id}`}
                name={`zone-${zone.id}`}
                type="checkbox"
                defaultChecked={!!category?.zones.find((z) => z.zone.id === zone.id)}
              />
              <label htmlFor={`zone-${zone.id}`}>{zone.name}</label>
            </div>
          ))}
        </div>
      </LineCard>

      <Input id="categoryTitle" type="text" label="Título" placeholder="Título" required defaultValue={category?.categoryTitle} />
      <Input id="buttonText" type="text" label="Texto del botón" placeholder="Texto del botón" required defaultValue={category?.buttonText} />

      <LineCard label="Servicios extra">
        <div className="flex flex-col gap-4 max-w-xl">
          {Object.values(EXTRA_SERVICES).map((extraService) => (
            <div key={extraService} className="flex items-center gap-2">
              <input id={extraService} name={extraService} type="checkbox" defaultChecked={category?.extraServices.includes(extraService)} />
              <label htmlFor={extraService}>{translations.extraServices[extraService]}</label>
            </div>
          ))}
        </div>
      </LineCard>

      <LineCard label="Horarios">
        <div className="flex flex-col gap-4 max-w-xl">
          {Object.values(SCHEDULES).map((schedule) => (
            <div key={schedule} className="flex items-center gap-2">
              <input id={schedule} name={schedule} type="checkbox" defaultChecked={category?.schedules.includes(schedule)} />
              <label htmlFor={schedule}>{translations.schedules[schedule]}</label>
            </div>
          ))}
        </div>
      </LineCard>

      <LineCard label="Tipo">
        <select
          id="type"
          className="border-b-dark-text py-2 px-4 rounded"
          defaultValue={category?.type}
          onChange={handleSelectChange}
          required
          disabled={editMode}
        >
          <option disabled value={''}>
            Selecciona tipo
          </option>
          {Object.values(CATEGORY_TYPES).map((type) => (
            <option value={type}>{translations.categoryTypes[type]}</option>
          ))}
        </select>

        {editMode && <small>El tipo no puede ser editado</small>}

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

      <button type="submit" className="w-full bg-dark-text py-2 px-4 rounded text-light-text disabled:opacity-60" disabled={loading}>
        {editMode ? 'Editar' : 'Crear'}
      </button>
    </form>
  )
}
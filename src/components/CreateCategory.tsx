import React, { FormEvent, useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'
import { CATEGORY_TYPES, CategorySI, EXTRA_SERVICES, SCHEDULES, ZoneSI } from 'src/typesSupabase'
import { createCategory, createZone, getZones } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import { Input } from './Input'
import LineCard from './LineCard'

export default function CreateCategory({ categories }: { categories: CategorySI[] }) {
  const [loading, setLoading] = useState(false)
  const [zones, setZones] = useState<ZoneSI[]>()
  const [zoneId, setZoneId] = useState<number>(null)
  const [type, setType] = useState<CATEGORY_TYPES>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const categoryTitle = formData.get('categoryTitle') as string
    const buttonText = formData.get('buttonText') as string

    const extraServices = Object.values(EXTRA_SERVICES)
      .filter((extraService) => formData.get(extraService) === 'on')
      .map((extraService) => extraService)
    const schedules = Object.values(SCHEDULES)
      .filter((schedule) => formData.get(schedule) === 'on')
      .map((schedule) => schedule)

    const slug = createSlug(categoryTitle)

    const newCategory: CategorySI = { categoryTitle, buttonText, type, extraServices, schedules, slug }
    await createCategory({ zoneId, newCategory })
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

    if (id === 'zoneId') setZoneId(Number(selectedValue))
    if (id === 'type') setType(selectedValue as CATEGORY_TYPES)
  }

  useEffect(() => {
    fetchZones()
  }, [])

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <LineCard label="Zona">
        <select id="zoneId" className="border-b-dark-text py-2 px-4 rounded" onChange={handleSelectChange} defaultValue="">
          <option disabled value="">
            Selecciona zona
          </option>
          {zones?.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
      </LineCard>

      <Input id="categoryTitle" type="text" label="Título" placeholder="Título" />
      <Input id="buttonText" type="text" label="Texto del botón" placeholder="Texto del botón" />

      <LineCard label="Servicios extra">
        <div className="flex flex-col gap-4 max-w-md">
          {Object.values(EXTRA_SERVICES).map((extraService) => (
            <div key={extraService} className="flex items-center gap-2">
              <input id={extraService} name={extraService} type="checkbox" />
              <label htmlFor={extraService}>{translations.extraServices[extraService]}</label>
            </div>
          ))}
        </div>
      </LineCard>

      <LineCard label="Horarios">
        <div className="flex flex-col gap-4 max-w-md">
          {Object.values(SCHEDULES).map((schedule) => (
            <div key={schedule} className="flex items-center gap-2">
              <input id={schedule} name={schedule} type="checkbox" />
              <label htmlFor={schedule}>{translations.schedules[schedule]}</label>
            </div>
          ))}
        </div>
      </LineCard>

      <LineCard label="Tipo">
        <select id="type" className="border-b-dark-text py-2 px-4 rounded" defaultValue="" onChange={handleSelectChange}>
          <option disabled value="">
            Selecciona tipo
          </option>
          <option value="menu">Menú</option>
          <option value="sections">Secciones</option>
          <option value="products">Productos</option>
        </select>

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
        Crear
      </button>
    </form>
  )
}

import React, { FormEvent, useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'
import { CATEGORY_TYPES, CategorySI, EXTRA_SERVICES, SCHEDULES, SectionSI, ZoneSI } from 'src/typesSupabase'
import { createCategory, createSection, createZone, getZones } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import { Input } from './Input'
import LineCard from './LineCard'

export default function CreateSection({ category, sections }: { category: CategorySI; sections: SectionSI[] }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string

    const extraServices = Object.values(EXTRA_SERVICES)
      .filter((extraService) => formData.get(extraService) === 'on')
      .map((extraService) => extraService)

    const newSection: SectionSI = {
      title,
      extraServices,
      order: sections.sort((a, b) => b.order - a.order)[0].order + 1
    }
    await createSection({ categoryId: category.id, newSection })
    // await createCategory({ zoneId, newCategory })
    window.location.reload()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Input id="title" type="text" label="Título" placeholder="Título" />

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

      <button type="submit" className="w-full bg-dark-text py-2 px-4 rounded text-light-text disabled:opacity-60" disabled={loading}>
        Crear
      </button>
    </form>
  )
}

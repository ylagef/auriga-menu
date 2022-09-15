import React, { FormEvent, useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'
import { CATEGORY_TYPES, CategorySI, EXTRA_SERVICES, SCHEDULES, ZoneSI } from 'src/typesSupabase'
import { createCategory, createZone, getZones, updateZone } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import Button, { BUTTON_TYPES } from './Button'
import { Input } from './Input'
import LineCard from './LineCard'

export default function ZoneForm({ zone }: { zone?: ZoneSI }) {
  const updateMode = !!zone
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const slug = createSlug(name)
    if (updateMode) {
      await updateZone({ restaurantId: 1, name, slug })
    } else {
      await createZone({ restaurantId: 1, name, slug })
    }

    window.location.reload()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Input id="name" type="text" label="Nombre" placeholder="Nombre" required defaultValue={zone?.name} />

      <Button type={BUTTON_TYPES.SUBMIT} className="w-full" disabled={loading}>
        {updateMode ? 'Editar' : 'Crear'}
      </Button>
    </form>
  )
}

import React, { FormEvent, useEffect, useState } from 'react'
import { ZoneSI } from 'src/typesSupabase'
import { createZone, updateZone } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import Error from './admin/Error'
import Info from './admin/Info'
import Button, { BUTTON_TYPES } from './Button'
import { Input } from './Input'

export default function ZoneForm({ zone, defaultOpen }: { zone?: ZoneSI; defaultOpen?: boolean }) {
  const updateMode = !!zone
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>(null)
  const [open, setOpen] = useState(defaultOpen)
  const [slug, setSlug] = useState(zone?.slug)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const slug = createSlug(name)

    try {
      if (updateMode) {
        await updateZone({ restaurantId: 1, name, slug })
      } else {
        await createZone({ restaurantId: 1, name, slug })
      }

      window.location.reload()
    } catch (e) {
      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  const updateSlug = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.currentTarget
    const value = inputElement.value
    setSlug(createSlug(value))
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
        <p>Modificar el nombre modificará también la ruta:</p>
        {slug && <p className="text-center font-medium">auriga-menu.netlify.app/{slug}</p>}
      </Info>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Input id="name" label="Nombre" placeholder="Nombre" required defaultValue={zone?.name} onChange={updateSlug} />

        {error && <Error>{error}</Error>}

        <Button type={BUTTON_TYPES.SUBMIT} className="w-full" disabled={loading}>
          {updateMode ? 'Actualizar' : 'Añadir'}
        </Button>
      </form>
    </div>
  )
}

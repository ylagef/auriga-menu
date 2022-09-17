import Button, { BUTTON_TYPES } from '@components/admin/Button'
import Error from '@components/admin/Error'
import Info from '@components/admin/Info'
import { Input } from '@components/admin/Input'
import React, { FormEvent, useEffect, useState } from 'react'
import slug from 'slug'
import { ZoneSI } from 'src/types'
import { updateZone } from 'src/utils/supabase'

export default function ZoneForm({ zone, defaultOpen }: { zone?: ZoneSI; defaultOpen?: boolean }) {
  const updateMode = !!zone
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>(null)
  const [open, setOpen] = useState(defaultOpen)
  const [currentSlug, setCurrentSlug] = useState(zone?.slug)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const newSlug = slug(name)

    try {
      await updateZone({ id: zone.id, name, slug: newSlug })
      window.location.href = `/admin/zonas/${newSlug}`
    } catch (e) {
      if (e.message === '23505') {
        return setError('Ya existe una zona con este nombre (y la url debe ser única).')
      }

      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  const updateSlug = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.currentTarget
    const value = inputElement.value
    setCurrentSlug(slug(value))
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
        <p>
          Modificar el nombre modificará también la ruta <strong>(el QR ya no será válido)</strong>:
        </p>
        {currentSlug && <p className="text-center font-medium">auriga-menu.netlify.app/{currentSlug}</p>}
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

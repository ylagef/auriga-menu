import React, { FormEvent, useState } from 'react'
import { ZoneSI } from 'src/typesSupabase'
import { createZone, updateZone } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import Info from './admin/Info'
import Button, { BUTTON_TYPES } from './Button'
import { Input } from './Input'

export default function ZoneForm({ zone, defaultOpen }: { zone?: ZoneSI; defaultOpen?: boolean }) {
  const updateMode = !!zone
  const [loading, setLoading] = useState(false)
  // const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const [slug, setSlug] = useState(zone?.slug)

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

  const updateSlug = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.currentTarget
    const value = inputElement.value
    setSlug(createSlug(value))
  }

  // const deleteZone = async () => {
  //   // await deleteSectionById({ sectionId: section.id })
  //   window.history.back()
  // }

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

        <Button type={BUTTON_TYPES.SUBMIT} className="w-full" disabled={loading}>
          {updateMode ? 'Actualizar' : 'Añadir'}
        </Button>
      </form>

      {/* {updateMode &&
        (!confirmDeletion ? (
          <button
            className="text-red-700 font-semibold"
            onClick={() => {
              setConfirmDeletion(true)
            }}
          >
            ELIMINAR ZONA
          </button>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <span>¿Seguro que quieres eliminar esta zona?</span>
            <span>
              Se eliminarán también <strong>todas sus categorías, secciones, productos</strong>...
            </span>
            <Button className="w-full bg-red-700" onClick={deleteZone}>
              Confirmar eliminación
            </Button>
          </div>
        ))} */}
    </div>
  )
}

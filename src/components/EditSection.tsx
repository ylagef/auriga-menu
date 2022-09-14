import { FormEvent, useState } from 'react'
import { SectionSI } from 'src/typesSupabase'
import { createZone } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import { Input } from './Input'

export default function CreateZone({ section }: { section: SectionSI }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const slug = createSlug(name)
    await createZone({ restaurantId: 1, name, slug })

    window.location.reload()
  }

  return (
    <button type="submit" className="self-end bg-dark-text py-2 px-4 rounded text-light-text disabled:opacity-60" disabled={loading}>
      Editar
    </button>
  )

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Input id="name" type="text" label="Nombre" placeholder="Nombre" value={section.title} />

      <button type="submit" className="w-full bg-dark-text py-2 px-4 rounded text-light-text disabled:opacity-60" disabled={loading}>
        Editar
      </button>
    </form>
  )
}

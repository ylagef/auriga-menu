import { FormEvent, useState } from 'react'
import { createZone } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import { Input } from './Input'

export default function CreateZone() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Input id="name" type="text" label="Nombre" placeholder="Nombre" />

      <button type="submit" className="w-full bg-dark-text py-2 px-4 rounded text-light-text disabled:opacity-60" disabled={loading}>
        Crear
      </button>
    </form>
  )
}

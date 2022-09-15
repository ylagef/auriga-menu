import React, { useEffect } from 'react'
import { supabase } from 'src/utils/supabase'

import Button, { BUTTON_TYPES } from './Button'
import { Input } from './Input'

export default function SetPasswordForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password') as string

    await supabase.auth.update({ password })
  }

  useEffect(() => {
    const session = supabase.auth.session()

    if (!session) {
      console.warn('Session not found - redirect to login')
      window.location.href = '/admin/login'
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Input label="Nueva contraseña" type="password" id="password" placeholder="∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗" />
      </div>

      <Button type={BUTTON_TYPES.SUBMIT}>Actualizar contraseña</Button>
    </form>
  )
}

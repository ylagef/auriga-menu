import Button, { BUTTON_TYPES } from '@components/admin/Button'
import { Input } from '@components/admin/Input'
import React from 'react'
import { supabase } from 'src/utils/supabase'

export default function SetPasswordForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password') as string

    const { error } = await supabase.auth.update({ password })
    if (!error) window.location.href = '/admin/login'
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Input label="Nueva contraseña" type="password" id="password" placeholder="∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗" required />
      </div>

      <Button type={BUTTON_TYPES.SUBMIT}>Actualizar contraseña</Button>
    </form>
  )
}

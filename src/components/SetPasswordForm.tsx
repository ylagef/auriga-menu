import React, { useEffect } from 'react'
import { supabase } from 'src/utils/supabase'

import Button, { BUTTON_TYPES } from './Button'

export default function SetPasswordForm() {
  const [password, setPassword] = React.useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await supabase.auth.update({ password })
  }

  useEffect(() => {
    const session = supabase.auth.session()

    if (!session) {
      console.warn('Session not found - redirect to login')
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
      </div>

      <Button type={BUTTON_TYPES.SUBMIT}>Actualizar contraseña</Button>
    </form>
  )
}

import { FormEvent, useState } from 'react'
import { setCookie } from 'src/utils/cookies'
import { supabase } from 'src/utils/supabase'

import Button, { BUTTON_TYPES } from './Button'
import { Input } from './Input'

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.api.signInWithEmail(email, password)

    if (error) {
      setError(error.message)
      return setLoading(false)
    }
    setError(null)

    const { access_token: accessToken, expires_at: expiresAt, refresh_token: refreshToken } = data

    setCookie('sup-access-token', accessToken, expiresAt)
    setCookie('sup-refresh-token', refreshToken, expiresAt)

    supabase.auth.setAuth(accessToken)

    window.location.href = '/admin'
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input id="email" label="Email" type="email" />
      <Input id="password" label="Contraseña" type="password" />

      <Button type={BUTTON_TYPES.SUBMIT} disabled={loading}>
        Login
      </Button>

      {error && <label className="text-center text-red-600">{error}</label>}
    </form>
  )
}

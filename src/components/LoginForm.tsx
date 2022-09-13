import { FormEvent, useState } from 'react'
import { setCookie } from 'src/utils/cookies'
import { supabase } from 'src/utils/supabase'

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
    console.log({ email, password })

    const { data, error } = await supabase.auth.api.signInWithEmail(email, password)
    console.log({ data, error })

    if (error) {
      setError(error.message)
      return setLoading(false)
    }
    setError(null)

    const { access_token: accessToken, expires_at: expiresAt, refresh_token: refreshToken } = data

    setCookie('sup-access-token', accessToken, expiresAt)
    setCookie('sup-refresh-token', refreshToken, expiresAt)

    window.location.href = '/admin'
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="w-[50%] text-right" htmlFor="email">
          Email
        </label>
        <input className="border-b-dark-text py-2 px-4 rounded" type="text" name="email" />
      </div>

      <div className="flex items-center gap-4">
        <label className="w-[50%] text-right" htmlFor="password">
          Contraseña
        </label>
        <input className="border-b-dark-text py-2 px-4 rounded" type="password" name="password" />
      </div>

      <button type="submit" className="bg-dark-text py-2 px-4 rounded text-light-text disabled:opacity-60" disabled={loading}>
        Login
      </button>

      {error && <label className="text-center text-red-600">{error}</label>}
    </form>
  )
}

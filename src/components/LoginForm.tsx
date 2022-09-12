import { FormEvent, useState } from 'react'
import { setCookie } from 'src/utils/cookies'
import { supabase } from 'src/utils/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { data, error } = await supabase.auth.api.signInWithEmail(email, password)
    console.log({ data, error })

    const { access_token: accessToken, expires_at: expiresAt, refresh_token: refreshToken } = data

    setCookie('sup-access-token', accessToken, expiresAt)
    setCookie('sup-refresh-token', refreshToken, expiresAt)

    window.location.href = '/admin'
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-4">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
      </div>

      <div className="flex gap-4">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
      </div>

      <button type="submit">Login</button>
    </form>
  )
}

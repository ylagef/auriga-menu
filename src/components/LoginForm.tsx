import React from 'react'
import { setCookie, updateCookiesDomain } from 'src/utils/cookies'
import { supabase } from 'src/utils/supabase'

export default function LoginForm() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { data, error } = await supabase.auth.api.signInWithEmail(email, password)
    console.log({ data, error })
    // get token from user
    const { access_token, expires_in, refresh_token } = data
    // set token in cookie
    setCookie('sup-access-token', access_token, expires_in, window.location.hostname)
    setCookie('sup-refresh-token', refresh_token, expires_in, window.location.hostname)

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

import React from 'react'
import { supabase } from 'src/utils/supabase'

export default function LoginForm() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { data, error } = await supabase.auth.api.signInWithEmail(email, password, { redirectTo: '/admin' })
    console.log({ data, error })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
      </div>

      <button type="submit">Login</button>
    </form>
  )
}

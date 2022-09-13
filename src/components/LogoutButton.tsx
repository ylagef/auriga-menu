import { eraseCookie } from 'src/utils/cookies'
import { supabase } from 'src/utils/supabase'

export default function LogoutButton() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    console.log({ error })
    eraseCookie('sup-access-token')
    eraseCookie('sup-refresh-token')
    window.location.href = '/admin/login'
  }

  return (
    <button className="pb-2 font-semibold" onClick={handleLogout}>
      Cerrar sesión
    </button>
  )
}

import LogoutIcon from 'src/icons/LogoutIcon'
import { eraseCookie } from 'src/utils/cookies'
import { supabase } from 'src/utils/supabase'

export default function LogoutButton() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      eraseCookie('sup-access-token')
      eraseCookie('sup-refresh-token')
      window.location.href = '/admin/login'
    } else {
      alert(`Error cerrando sesión: ${error.message}`)
    }
  }

  return (
    <button onClick={handleLogout}>
      <span className="flex items-center gap-2">
        Cerrar sesión
        <LogoutIcon />
      </span>
    </button>
  )
}

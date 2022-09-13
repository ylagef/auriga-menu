import LogoutIcon from 'src/icons/LogoutIcon'
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
    <button className="pb-2 z-20" onClick={handleLogout}>
      <LogoutIcon />
    </button>
  )
}

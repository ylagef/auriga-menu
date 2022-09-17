import BackIcon from 'src/icons/BackIcon'
import LogoutIcon from 'src/icons/LogoutIcon'
import { eraseCookie } from 'src/utils/cookies'
import { supabase } from 'src/utils/supabase'

export default function BackButton() {
  const handleBack = async () => {
    window.history.back()
  }

  return (
    <button onClick={handleBack}>
      <span className="flex items-center gap-2">
        <BackIcon />
        Atrás
      </span>
    </button>
  )
}

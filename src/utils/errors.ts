export const handleSupabaseError = (error) => {
  console.error(`ERR! ${error.code}: ${error.message}`)
  if (error.code === 'PGRST301') {
    // JWT expired
    alert('La sesión ha caducado.')
    window.location.href = '/admin/login'
  }

  throw new Error(error.code)
}

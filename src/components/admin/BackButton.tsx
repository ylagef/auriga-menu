import BackIcon from 'src/icons/BackIcon'

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

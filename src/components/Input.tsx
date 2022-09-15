export function Input({
  id,
  label,
  placeholder,
  type = 'text',
  value,
  required = false
}: {
  id: string
  label?: string
  placeholder?: string
  type?: string
  value?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <input className="border-b-dark-text py-2 px-4 rounded" type={type} name={id} placeholder={placeholder} value={value} required={required} />
    </div>
  )
}

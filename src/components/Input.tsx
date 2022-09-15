export function Input({
  id,
  label,
  placeholder,
  type = 'text',
  required = false,
  defaultValue
}: {
  id: string
  label?: string
  placeholder?: string
  type?: string

  required?: boolean
  defaultValue?: string
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id}>{label}</label>
      <input
        className="border-b-dark-text py-2 px-4 rounded"
        type={type}
        name={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  )
}

export function Input({ id, label, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <input className="border-b-dark-text py-2 px-4 rounded" type={type} name={id} placeholder={label} />
    </div>
  )
}

import React from 'react'

export function Input({
  id,
  label,
  placeholder,
  type = 'text',
  required = false,
  defaultValue,
  onChange
}: {
  id: string
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  defaultValue?: string
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
}) {
  if (type === 'textarea') {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor={id}>
          {label} {required && '*'}
        </label>
        <textarea
          className="border-b-dark-text py-2 px-4 rounded"
          name={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id}>
        {label} {required && '*'}
      </label>
      <input
        className="border-b-dark-text py-2 px-4 rounded"
        type={type}
        name={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        onChange={onChange}
      />
    </div>
  )
}

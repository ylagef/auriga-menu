import React, { useState } from 'react'

export function Input({
  id,
  label,
  placeholder,
  type = 'text',
  required = false,
  defaultValue,
  onChange,
  customValue = false
}: {
  id: string
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  defaultValue?: string
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
  customValue?: boolean
}) {
  const [customEnabled, setCustomEnabled] = useState(false)

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
      <div className="flex justify-between">
        <label htmlFor={id}>
          {label} {required && '*'}
        </label>

        {customValue && (
          <div className="flex gap-2 items-center justify-center">
            <label htmlFor={`${id}-custom-value`}>Personalizado</label>
            <input
              type="checkbox"
              name={`${id}-custom-value`}
              id={`${id}-custom-value`}
              className="w-5 h-5"
              onChange={(ev) => {
                setCustomEnabled(ev.target.checked)
              }}
            />
          </div>
        )}
      </div>
      <input
        className="border-b-dark-text py-2 px-4 rounded"
        type={customEnabled ? 'text' : type}
        name={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        onChange={onChange}
      />
    </div>
  )
}

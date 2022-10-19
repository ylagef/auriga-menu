import React from 'react'

export enum BUTTON_TYPES {
  BUTTON = 'button',
  SUBMIT = 'submit',
  RESET = 'reset'
}

interface Props {
  children: React.ReactNode
  type?: BUTTON_TYPES
  onClick?: () => void
  inverted?: boolean
  className?: string
  href?: string
  disabled?: boolean
  error?: boolean
}

export default function Button({
  children,
  type = BUTTON_TYPES.BUTTON,
  onClick,
  href,
  inverted = false,
  className,
  disabled = false,
  error = false
}: Props) {
  const theme = inverted ? 'text-dark-text border border-dark-text' : `${error ? 'bg-red-700' : 'bg-dark-text'} text-light-text`
  if (href) {
    return (
      <a className={`${theme} py-2 px-4 rounded ${className}`} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button className={`${theme} py-2 px-4 rounded disabled:opacity-60 ${className}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

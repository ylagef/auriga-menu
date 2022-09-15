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
  disabled?: boolean
}

export default function Button({ children, type = BUTTON_TYPES.BUTTON, onClick, inverted = false, className, disabled = false }: Props) {
  const theme = inverted ? 'text-dark-text border border-dark-text' : 'bg-dark-text text-light-text'
  return (
    <button className={`${theme} py-2 px-4 rounded disabled:opacity-60 ${className}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

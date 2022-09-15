import React from 'react'

interface Props {
  children: React.ReactNode
  label: string
}

export default function LineCard({ children, label }: Props) {
  return (
    <div className="flex flex-col gap-4 items-center border px-3 py-8 border-dark-text/20 w-full relative rounded-md mt-2">
      <span className="absolute top-[-1rem] left-2 bg-light-text rounded py-1 px-2 text-sm border border-dark-text/20">{label}</span>
      {children}
    </div>
  )
}

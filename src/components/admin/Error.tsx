import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function Error({ children }: Props) {
  return (
    <div className="w-full bg-red-200/30 p-4 flex flex-col gap-2 rounded-md border border-red-500">
      <h5 className="font-semibold">ERROR:</h5>
      <span>{children}</span>
    </div>
  )
}

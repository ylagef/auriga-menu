import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function Info({ children }: Props) {
  return <div className="w-full bg-teal-200/30 p-8 flex flex-col gap-2 rounded-md border border-teal-500">{children}</div>
}

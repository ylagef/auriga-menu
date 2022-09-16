import React from 'react'

interface Props {
  children: React.ReactNode
  title: string
}

export default function DetailSummaryContainer({ children, title }: Props) {
  return (
    <div className="flex flex-col">
      <h1>{title}</h1>
      <div className="flex flex-col ml-4 pl-4 py-2 border-l-2 border-dark-text/20">{children}</div>
    </div>
  )
}

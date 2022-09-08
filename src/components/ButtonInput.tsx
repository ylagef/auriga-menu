import { useEffect, useState } from 'react'

interface Props {
  children?: React.ReactNode
}
export default function ButtonInput({ children }: Props) {
  const [editing, setEditing] = useState(true)

  useEffect(() => {
    fetch('/api/restaurante')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => {
        console.error(err)
      })
  }, [])

  if (!editing)
    return (
      <button
        className="py-3 px-8 bg-light-text/80 rounded w-60 text-center mx-auto"
        onClick={() => {
          setEditing(true)
        }}
      >
        {children}
      </button>
    )

  return (
    <div className="flex gap-2 justify-center">
      <input className="py-3 px-8 bg-light-text/80 rounded w-60 text-center" placeholder="Nombre de la zona" />

      <button
        className="py-3 px-4 bg-light-text/80 rounded text-center"
        onClick={() => {
          fetch('/api/restaurante')
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((err) => {
              console.error(err)
            })
          setEditing(false)
        }}
      >
        ok
      </button>

      <button
        className="py-3 px-4 bg-light-text/80 rounded text-center"
        onClick={() => {
          setEditing(false)
        }}
      >
        X
      </button>
    </div>
  )
}

import { useState } from 'react'

interface Props {
  children?: string
  callback: (text: string) => Promise<void>
}
export default function ButtonInput({ children, callback }: Props) {
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [text, setText] = useState('')

  if (!editing) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <button
          className="py-3 px-8 bg-light-text/80 rounded w-60 text-center mx-auto"
          onClick={() => {
            setEditing(true)
          }}
        >
          {children}
        </button>

        {success && <span>Creación correcta</span>}
      </div>
    )
  }

  const handleAdd = async () => {
    try {
      await callback(text)
      setText('')
      setEditing(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex gap-2 justify-center flex-col w-fit mx-auto rounded border border-dark-text/20 p-2">
      <input
        className="py-3 px-8 bg-light-text/80 rounded w-60 text-center"
        placeholder="Nombre de la zona"
        onChange={(ev) => {
          setText(ev.target.value)
        }}
      />

      <div className="flex justify-between">
        <button className="py-3 px-4 text-center" onClick={handleAdd}>
          Añadir
        </button>

        <button
          className="py-3 px-4 text-center"
          onClick={() => {
            setEditing(false)
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

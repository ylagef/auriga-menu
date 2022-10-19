import { useState } from 'react'

interface Props {
  children?: string
  callback: (text: string) => Promise<void>
  initialText?: string
}
export default function ButtonInput({ children, callback, initialText = '' }: Props) {
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [text, setText] = useState(initialText)

  if (!editing) {
    return (
      <div className="w-fit mx-auto">
        <button
          className="py-3 px-8 m-w-60 text-center mx-auto rounded border border-dark-text/10"
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
        className="py-2 px-4 w-60 text-center bg-transparent border-b border-dark-text"
        placeholder="Nombre"
        onChange={(ev) => {
          setText(ev.target.value)
        }}
        value={text}
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

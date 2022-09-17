import Button, { BUTTON_TYPES } from '@components/admin/Button'
import Error from '@components/admin/Error'
import { Input } from '@components/admin/Input'
import LineCard from '@components/admin/LineCard'
import { FormEvent, useEffect, useState } from 'react'
import TrashIcon from 'src/icons/TrashIcon'
import { CategorySI, CourseSI } from 'src/types'
import { createCourse, deleteCourseById, updateCourse } from 'src/utils/supabase'

export default function CourseForm({ category, defaultOpen, course }: { category?: CategorySI; defaultOpen?: boolean; course?: CourseSI }) {
  const updateMode = !!course
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>(null)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const [products, setProducts] = useState<string[]>(course?.products || [''])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const parsedOptions = products.map((_, index) => formData.get('option-' + index) as string)

    const courseObj: CourseSI = {
      categoryId: category.id,
      name,
      products: parsedOptions,
      order: course?.order || -1
    }
    try {
      if (updateMode) {
        courseObj.id = course.id
        await updateCourse({ courseObj })
      } else {
        await createCourse({ courseObj })
      }

      window.location.reload()
    } catch (e) {
      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  const deleteSection = async () => {
    try {
      setLoading(true)
      await deleteCourseById({ courseId: course.id })
      window.history.back()
    } catch (e) {
      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [error])

  if (!open)
    return (
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Abrir editor
      </Button>
    )

  return (
    <div className="flex flex-col gap-10 w-full">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Input id="name" label="Nombre" placeholder="Nombre" required defaultValue={course?.name} />

        <LineCard label="Opciones">
          {products.length > 0 && (
            <div className="flex flex-col w-full">
              {products.map((option, index) => (
                <div className="flex gap-2 items-center ml-8" key={`option-${index}`}>
                  <Input id={`option-${index}`} label={`Opción ${index + 1}`} placeholder={`Opción ${index + 1}`} defaultValue={option} required />
                  {products.length > 1 && index === products.length - 1 && (
                    <button
                      onClick={() => {
                        // remove last option
                        setProducts((prev) => prev.slice(0, -1))
                      }}
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <Button
            inverted
            onClick={() => {
              setProducts((prev) => [...prev, ''])
            }}
          >
            {products.length === 0 ? 'Añadir opciones' : 'Añadir otra opción'}
          </Button>
        </LineCard>

        {error && <Error>{error}</Error>}

        <Button type={BUTTON_TYPES.SUBMIT} className="w-full" disabled={loading}>
          {updateMode ? 'Actualizar' : 'Crear'}
        </Button>
      </form>

      {updateMode &&
        (!confirmDeletion ? (
          <button
            className="text-red-700 font-semibold"
            onClick={() => {
              setConfirmDeletion(true)
            }}
          >
            ELIMINAR PLATO
          </button>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <span>¿Seguro que quieres eliminar este plato?</span>
            <span>
              Se eliminarán también <strong>todas sus opciones</strong>.
            </span>
            <Button className="w-full" onClick={deleteSection} error disabled={loading}>
              Confirmar eliminación
            </Button>
          </div>
        ))}
    </div>
  )
}

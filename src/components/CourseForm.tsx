import { FormEvent, useState } from 'react'
import TrashIcon from 'src/icons/TrashIcon'
import { translations } from 'src/locales/translations'
import { CategorySI, CourseSI, EXTRA_SERVICES, MenuSI, SectionSI } from 'src/typesSupabase'
import { createCourse, createSection, deleteCourseById, deleteSectionById, updateCourse, updateSection } from 'src/utils/supabase'

import Button, { BUTTON_TYPES } from './Button'
import { Input } from './Input'
import LineCard from './LineCard'

export default function CourseForm({ menu, defaultOpen, course }: { menu?: MenuSI; defaultOpen?: boolean; course?: CourseSI }) {
  const updateMode = !!course
  const [loading, setLoading] = useState(false)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [open, setOpen] = useState(true) // TODO defaultOpen
  const [products, setProducts] = useState<string[]>(course?.products || ['']) // TODO defaultOpen

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const parsedOptions = products.map((_, index) => formData.get('option-' + index) as string)

    const courseObj: CourseSI = {
      menuId: menu.id,
      name,
      products: parsedOptions,
      order: menu.courses.sort((a, b) => b.order - a.order)[0].order + 1
    }
    if (updateMode) {
      courseObj.id = course.id
      await updateCourse({ courseObj })
    } else {
      await createCourse({ courseObj })
    }

    window.location.reload()
  }

  const deleteSection = async () => {
    await deleteCourseById({ courseId: course.id })
    window.history.back()
  }

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
        <Input id="name" type="text" label="Nombre" placeholder="Nombre" required defaultValue={course?.name} />

        <LineCard label="Opciones">
          {products.length > 0 && (
            <div className="flex flex-col w-full">
              {products.map((option, index) => (
                <div className="flex gap-2 items-center ml-8" key={`option-${index}`}>
                  <Input id={`option-${index}`} type="text" placeholder={`Opción ${index + 1}`} defaultValue={option} required />
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
            <Button className="w-full bg-red-700" onClick={deleteSection}>
              Confirmar eliminación
            </Button>
          </div>
        ))}
    </div>
  )
}
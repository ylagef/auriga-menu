import Button, { BUTTON_TYPES } from '@components/admin/Button'
import Error from '@components/admin/Error'
import { Input } from '@components/admin/Input'
import LineCard from '@components/admin/LineCard'
import { FormEvent, useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'
import { CategorySI, EXTRA_SERVICES, SectionSI } from 'src/types'
import { createSection, deleteSectionById, updateSection } from 'src/utils/supabase'

export default function SectionForm({ category, section, defaultOpen }: { category?: CategorySI; section?: SectionSI; defaultOpen?: boolean }) {
  const updateMode = !!section
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>(null)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [open, setOpen] = useState(defaultOpen)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string
    const order = formData.get('order') as string

    const extraServices = Object.values(EXTRA_SERVICES)
      .filter((extraService) => formData.get(extraService) === 'on')
      .map((extraService) => extraService)

    const sectionObj: SectionSI = {
      title,
      extraServices,
      order: Number(order)
    }

    try {
      if (updateMode) {
        sectionObj.id = section.id
        await updateSection({ sectionObj })
      } else {
        await createSection({ categoryId: category.id, sectionObj })
      }

      window.location.reload()
    } catch (e) {
      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  const deleteSection = async () => {
    try {
      setLoading(true)
      await deleteSectionById({ sectionId: section.id })
      window.location.reload()
    } catch (e) {
      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  const getDefaultOrder = () => (section?.order ? (section.order > 0 ? String(section.order) : '1') : '1')

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
    <div className="flex flex-col gap-10">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Input id="order" type="number" label="Orden" required defaultValue={getDefaultOrder()} steps={1} min={1} />
        <Input id="title" label="Título" placeholder="Título" required defaultValue={section?.title} />

        <LineCard label="Servicios extra">
          <div className="flex flex-col gap-4 max-w-xl">
            {Object.values(EXTRA_SERVICES).map((extraService) => (
              <div key={extraService} className="flex items-center gap-2">
                <input id={extraService} name={extraService} type="checkbox" defaultChecked={!!section?.extraServices?.includes(extraService)} />
                <label htmlFor={extraService}>{translations.extraServices[extraService]}</label>
              </div>
            ))}
          </div>
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
            ELIMINAR SECCIÓN
          </button>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <span>¿Seguro que quieres eliminar esta sección?</span>
            <span>
              Se eliminarán también <strong>todos sus productos</strong>.
            </span>
            <Button className="w-full" onClick={deleteSection} error disabled={loading}>
              Confirmar eliminación
            </Button>
          </div>
        ))}
    </div>
  )
}

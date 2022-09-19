import Button, { BUTTON_TYPES } from '@components/admin/Button'
import Error from '@components/admin/Error'
import { Input } from '@components/admin/Input'
import LineCard from '@components/admin/LineCard'
import React, { FormEvent, useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'
import { CategorySI, EXTRA_SERVICES, SECTION_TYPES, SectionSI } from 'src/types'
import { createSection, deleteSectionById, updateSection } from 'src/utils/supabase'

import Info from './Info'

export default function SectionForm({
  category,
  section,
  defaultOpen,
  hasSubsections
}: {
  category?: CategorySI
  section?: SectionSI
  defaultOpen?: boolean
  hasSubsections?: boolean
}) {
  const updateMode = !!section && !hasSubsections
  console.log({ section, hasSubsections })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>(null)
  const [confirmDeletion, setConfirmDeletion] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const [type, setType] = useState<SECTION_TYPES>(section?.type)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    // get inputs from form
    const formData = new FormData(event.currentTarget)
    const order = formData.get('order') as string
    const title = formData.get('title') as string

    const extraServices = Object.values(EXTRA_SERVICES)
      .filter((extraService) => formData.get(extraService) === 'on')
      .map((extraService) => extraService)

    const sectionObj: SectionSI = {
      type,
      title,
      extraServices,
      order: Number(order)
    }

    try {
      if (updateMode) {
        sectionObj.id = section.id
        await updateSection({ sectionObj })
      } else if (hasSubsections) {
        await createSection({ parentSectionId: section.id, sectionObj })
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
      window.history.back()
    } catch (e) {
      setError('Ha habido un error. Inténtalo de nuevo más tarde.')
    }
  }

  const getDefaultOrder = () => (section?.order && updateMode ? (section.order > 0 ? String(section.order) : '1') : '1')

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectElement = event.currentTarget
    const selectedValue = selectElement.value

    setType(selectedValue as SECTION_TYPES)
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
    <div className="flex flex-col gap-10">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Input id="order" type="number" label="Orden" required defaultValue={getDefaultOrder()} steps={1} min={1} />
        <Input id="title" label="Título" placeholder="Título" required defaultValue={updateMode ? section?.title : ''} />

        <LineCard label="Servicios extra">
          <div className="flex flex-col gap-4 max-w-xl">
            {Object.values(EXTRA_SERVICES).map((extraService) => (
              <div key={extraService} className="flex items-center gap-2">
                <input
                  id={extraService}
                  name={extraService}
                  type="checkbox"
                  defaultChecked={updateMode ? !!section?.extraServices?.includes(extraService) : false}
                />
                <label htmlFor={extraService}>{translations.extraServices[extraService]}</label>
              </div>
            ))}
          </div>
        </LineCard>

        {!hasSubsections && (
          <LineCard label="Tipo *">
            <select
              id="section-type"
              className="border-b-dark-text py-2 px-4 rounded"
              defaultValue={section?.type || ''}
              disabled={updateMode}
              onChange={handleSelectChange}
              required
            >
              <option disabled value="">
                Selecciona tipo
              </option>
              {Object.values(SECTION_TYPES).map((type) => (
                <option key={type} value={type}>
                  {translations.sectionTypes[type]}
                </option>
              ))}
            </select>

            {updateMode && (
              <Info>
                <small>El tipo no puede ser editado.</small>
              </Info>
            )}

            <ul className="text-sm">
              <li>
                <span className="font-semibold">Subsecciones</span>
                <div className="pl-4">
                  Subsecciones con sus productos. <span className="italic">(ej. Blancos, Tintos...)</span>
                </div>
              </li>
              <li>
                <span className="font-semibold">Productos</span>
                <div className="pl-4">Listado de productos.</div>
              </li>
            </ul>
          </LineCard>
        )}

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

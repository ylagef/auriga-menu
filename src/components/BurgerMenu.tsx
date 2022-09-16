import { useEffect, useState } from 'react'
import MenuIcon from 'src/icons/MenuIcon'
import { CategorySI } from 'src/types'
import { getCategoriesByZoneId, getCategoriesByZoneSlug } from 'src/utils/supabase'

interface Props {
  dark?: boolean
}

export default function BurgerMenu({ dark = false }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [zone, setZone] = useState<string>(null)
  const [sectionSlug, setSectionSlug] = useState<string>(null)
  const [categories, setCategories] = useState<CategorySI[]>([])

  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const fetchCategories = async (zoneSlug) => {
    console.log({ zoneSlug })
    const categoriesArr = await getCategoriesByZoneSlug({ zoneSlug })
    console.log({ categoriesArr })
    setCategories(categoriesArr)
  }

  useEffect(() => {
    if (!zone) return

    fetchCategories(zone)
  }, [zone])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  }, [isOpen])

  useEffect(() => {
    setZone(window.location.pathname.split('/')[1])
    setSectionSlug(window.location.pathname.split('/')[2])
  }, [])

  if (!sectionSlug || (sectionSlug && sectionSlug === 'login')) return null

  return (
    <div className={`w-screen absolute overflow-x-hidden top-0 left-0 ${isOpen ? 'h-full' : 'h-20'}`}>
      <button id="menu" className="absolute top-4 right-4 py-2 px-4 rounded w-fit z-20" onClick={handleOpen}>
        <MenuIcon dark={dark} opened={isOpen} />
      </button>

      <div className={`absolute top-0 w-screen h-full bg-black/80 p-4 transition-[left] overflow-y-auto ${isOpen ? 'left-0' : 'left-full'}`}>
        <div className="flex flex-col items-center gap-4 mt-16">
          {categories?.map((category) => {
            return (
              <a key={category.id} href={`/${zone}/${category.id}`} className="text-light-text font-medium text-xl">
                {category.buttonText}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

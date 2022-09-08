import { useEffect, useState } from 'react'
import MenuIcon from 'src/icons/MenuIcon'
import { RESTAURANT } from 'src/mock/auriga'
import { SectionI } from 'src/types'

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [zone, setZone] = useState<string>(null)
  const [sectionSlug, setSectionSlug] = useState<string>(null)
  const [sections, setSections] = useState<SectionI[]>([])

  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!zone) return
    setSections(RESTAURANT.zones[zone]?.sections)
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
      <button id="menu" className="absolute top-4 right-4 py-2 px-4 rounded w-fit z-30" onClick={handleOpen}>
        <MenuIcon opened={isOpen} />
      </button>

      <div className={`absolute top-0 w-screen h-full bg-black/80 p-4 transition-[left] overflow-y-auto ${isOpen ? 'left-0' : 'left-full'}`}>
        <div className="flex flex-col items-center gap-4 mt-16">
          {sections?.map((section) => {
            return (
              <a key={section.id} href={`/${zone}/${section.id}`} className="text-light-text font-medium text-xl">
                {section.buttonText}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

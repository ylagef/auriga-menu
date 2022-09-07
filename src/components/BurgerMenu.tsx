import { useEffect, useState } from 'react'
import MenuIcon from 'src/icons/MenuIcon'
import { RESTAURANT } from 'src/mock/auriga'
import { Section } from 'src/types'

function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [zone, setZone] = useState(null)
  const [section, setSection] = useState(null)
  const [sections, setSections] = useState<Section[]>([])

  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!zone) return
    setSections(RESTAURANT.zones[zone].sections)
  }, [zone])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  }, [isOpen])

  useEffect(() => {
    setZone(window.location.pathname.split('/')[1])
    setSection(window.location.pathname.split('/')[2])
  }, [])

  if (!section) return null

  return (
    <div className="w-screen h-full absolute overflow-x-hidden top-0 left-0">
      <button id="menu" className="absolute top-4 right-4 py-2 px-4 rounded w-fit z-30" onClick={handleOpen}>
        <MenuIcon opened={isOpen} />
      </button>

      <div className={`absolute top-0 z-20 w-screen h-full bg-black/80 p-4 transition-[left] overflow-y-auto ${isOpen ? 'left-0' : 'left-full'}`}>
        <div className="flex flex-col items-center gap-4 mt-16">
          {sections?.map((section) => (
            <a key={section.id} href={`/${zone}/${section.id}`} className="text-light-text font-medium text-xl">
              {section.buttonText}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BurgerMenu

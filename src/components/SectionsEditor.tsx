import { SectionI } from 'src/types'

import ProductEditor from './ProductEditor'

interface Props {
  sections: SectionI[]
}

export default function SectionsEditor({ sections }: Props) {
  return (
    <div className="pl-4">
      {sections?.map((section) => (
        <div>
          {section.title && <h2> {section.title}</h2>}
          <div>
            {section.products.map((product) => (
              <ProductEditor product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

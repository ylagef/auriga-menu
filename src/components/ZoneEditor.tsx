import { ZoneI } from 'src/types'

import MenuEditor from './MenuEditor'
import ProductEditor from './ProductEditor'
import SectionsEditor from './SectionsEditor'

interface Props {
  zone: ZoneI
}
export default function ZoneEditor({ zone }: Props) {
  console.log({ zone })

  return (
    <div>
      <h1>{zone?.name}</h1>

      <div>
        {zone?.categories.map((category) => (
          <div key={category.id} className="pl-4">
            {category.categoryTitle && <h2>{category.categoryTitle}</h2>}

            <div className="pl-4">{category.menu && <MenuEditor menu={category.menu} />}</div>
            <div className="pl-4">{category.sections && <SectionsEditor sections={category.sections} />}</div>
            <div className="pl-4">
              {category.products && (
                <div>
                  {category.products.map((product) => (
                    <ProductEditor product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

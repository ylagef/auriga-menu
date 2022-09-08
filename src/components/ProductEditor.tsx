import { ProductI } from 'src/types'

import Allergen from './Allergen'

interface Props {
  product: ProductI
}

export default function ProductEditor({ product }: Props) {
  return (
    <div className="pl-4">
      <p className="font-medium">{product.name}</p>
      <div className="pl-4">
        <p>{product.price}€</p>

        {product.description && <small className="opacity-70">{product.description}</small>}

        <div className="pl-4">
          {product.options?.map((option) => (
            <small>OP: {option}</small>
          ))}
        </div>

        <div className="flex gap-2">
          {product.allergens?.map((allergen) => (
            <Allergen allergen={allergen} />
          ))}
        </div>
      </div>
    </div>
  )
}

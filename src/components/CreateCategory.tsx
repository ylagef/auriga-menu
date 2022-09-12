import { createZone } from 'src/utils/supabase'
import { createSlug } from 'src/utils/utilities'

import ButtonInput from './ButtonInput'

export default function CreateCategory() {
  return (
    <ButtonInput
      callback={async (text) => {
        const slug = createSlug(text)
        // await createZone({ restaurantId: 1, name: text, slug })
      }}
    >
      CREAR NUEVA CATEGORÍA
    </ButtonInput>
  )
}

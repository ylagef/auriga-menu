import { Menu } from 'src/types'

interface Props {
  menu: Menu
}

function MenuEditor({ menu }: Props) {
  return (
    <div>
      <h3>{menu.price}€</h3>
      <div>
        {menu.extraServices?.map((extraService) => (
          <p key={extraService}>{extraService}</p>
        ))}
      </div>

      {menu.courses.map((course) => (
        <div key={course.id} className="pl-4">
          <h4>{course.name}</h4>

          <div className="pl-4">
            {course.products.map((product) => (
              <p key={product.trim()}>{product}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MenuEditor

export enum EXTRA_SERVICES {
  BREAD = 'bread',
  GLUTEN_FREE_BREAD = 'glutenFreeBread',
  RYE_BREAD = 'ryeBread',
  GLUTEN_FREE_BUN = 'glutenFreeBun',
  BREAD_WATER_COFFEE = 'breadWaterCoffee'
}

export enum SCHEDULES {
  BREAKFAST = 'breakfast',
  SNACK = 'snack',
  UNINTERRUPTED = 'uninterrupted'
}

export enum ALLERGENS {
  GLUTEN = 'gluten',
  LACTOSE = 'lactose',
  EGGS = 'eggs',
  FISH = 'fish',
  CELERY = 'celery',
  CRUSTACEANS = 'crustaceans',
  LUPINS = 'lupins',
  MOLLUSCS = 'molluscs',
  MUSTARD = 'mustard',
  NUTS = 'nuts',
  SESAME = 'sesame',
  SOY = 'soy',
  SULPHITES = 'sulphites',
  PEELING_FRUITS = 'peeling_fruits'
}

export enum CATEGORY_TYPES {
  MENU = 'menu',
  SECTIONS = 'sections',
  PRODUCTS = 'products'
}

export interface ProductSI {
  // fk
  categoryId?: number
  sectionId?: number

  id?: number
  order: number
  name: string
  description?: string
  options?: string[]
  price: string // String for "S/M"
  allergens?: ALLERGENS[]
}

export interface SectionSI {
  // fk
  categoryId?: number

  id?: number
  order?: number
  title?: string
  extraServices?: EXTRA_SERVICES[]

  // join
  products?: ProductSI[]
}

export interface CourseSI {
  // fk
  menuId: number

  id: number
  name: string
  products: string[]
}

export interface MenuSI {
  // fk
  categoryId: number

  id: number
  extraServices: EXTRA_SERVICES[]
  price: number
}

export interface ZoneSI {
  // fk
  restaurantId: number

  id: number
  slug: string
  name?: string
}

export interface CategorySI {
  id?: number
  type: CATEGORY_TYPES
  slug: string
  buttonText: string
  categoryTitle: string
  schedules?: string[]
  extraServices?: EXTRA_SERVICES[]

  // join
  order?: number
  orders?: { order: number }[]
  zones?: { zone: ZoneSI }[]
}

export interface ZonesCategoriesSI {
  // fk
  zoneId: number
  categoryId: number

  id: number
  order: number

  // join
  categories: CategorySI
}

export interface RestaurantSI {
  id: number
  name: string
  shortName?: string
}

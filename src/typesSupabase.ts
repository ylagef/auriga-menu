export enum EXTRA_SERVICES {
  BREAD = 'Servicio de pan 1,50€',
  GLUTEN_FREE_BREAD = 'Servicio de pan sin gluten 1,50€',
  RYE_BREAD = 'Opción de pan de centeno +1€',
  GLUTEN_FREE_BUN = 'Bollo sin gluten +1€',
  BREAD_WATER_COFFEE = 'Incluye servicio de pan, agua y café'
}

export enum SCHEDULES {
  BREAKFAST = 'Horario de desayunos de 8:00 a 12:30',
  SNACK = 'Horario de meriendas de 17:00 a 20:00',
  UNINTERRUPTED = 'Cocina ininterrumpida de 8:00 a 23:30'
}

export enum ALLERGENS {
  CELERY = 'celery',
  CRUSTACEANS = 'crustaceans',
  EGGS = 'eggs',
  FISH = 'fish',
  GLUTEN = 'gluten',
  LACTOSE = 'lactose',
  LUPINS = 'lupins',
  MOLLUSCS = 'molluscs',
  MUSTARD = 'mustard',
  NUTS = 'nuts',
  PEELING_FRUITS = 'peeling_fruits',
  SESAME = 'sesame',
  SOY = 'soy',
  SULPHITES = 'sulphites'
}

export interface ProductSI {
  // fk
  categoryId: number
  sectionId: number

  id: number
  order: number
  name: string
  description?: string
  options?: string[]
  price: number | string // String for "S/M"
  allergens?: ALLERGENS[]
}

export interface SectionSI {
  // fk
  categoryId: number

  id: number
  order: number
  title?: string
  extraServices?: EXTRA_SERVICES[]
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

export interface CategorySI {
  // fk
  zoneId: number

  id: number
  slug: string
  order: number
  buttonText: string
  categoryTitle?: string
  schedules?: string[]
  extraServices?: EXTRA_SERVICES[]
}

export interface ZoneSI {
  // fk
  restaurantId: number

  id: number
  slug: string
  name?: string
}

export interface RestaurantSI {
  id: number
  name: string
  shortName?: string
}

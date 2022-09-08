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

export interface ProductI {
  id: string
  order: number
  name: string
  description?: string
  options?: string[]
  price: number | string // String for "S/M"
  allergens?: ALLERGENS[]
}

export interface SectionI {
  id: string
  order: number
  title?: string
  extraServices?: EXTRA_SERVICES[]
  products: ProductI[]
}

export interface Course {
  id: string
  name: string
  products: string[]
}

export interface Menu {
  courses: Course[]
  extraServices: EXTRA_SERVICES[]
  price: number
}

export interface CategoryI {
  id: string
  order: number
  buttonText: string
  categoryTitle?: string
  schedules?: string[]
  extraServices?: EXTRA_SERVICES[]
  sections?: SectionI[]
  products?: ProductI[]
  menu?: Menu
}

export interface ZoneI {
  name?: string
  categories: CategoryI[]
}

export interface Restaurant {
  id: string
  name: string
  shortName?: string
  zones: { [key: string]: ZoneI }
}

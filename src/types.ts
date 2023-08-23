export enum EXTRA_SERVICES {
  BREAD = 'bread',
  GLUTEN_FREE_BREAD = 'glutenFreeBread',
  RYE_BREAD = 'ryeBread',
  GLUTEN_FREE_BUN = 'glutenFreeBun',
  BREAD_WATER_COFFEE = 'breadWaterCoffee',
  INTOLERANCE_ADVICE = 'intoleranceAdvice'
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
export enum SECTION_TYPES {
  SUBSECTIONS = 'subsections',
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
  price: string
  allergens?: ALLERGENS[]
  customPrice?: boolean
}

export interface SectionSI {
  // fk
  categoryId?: number
  parentSectionId?: number

  id?: number
  order?: number
  title?: string
  extraServices?: EXTRA_SERVICES[]
  type?: SECTION_TYPES

  // join
  products?: ProductSI[]
  subsections?: SectionSI[]
}

export interface CourseSI {
  // fk
  categoryId?: number

  id?: number
  name: string
  products: string[]
  order: number
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
  price?: string // in case of menu

  // join
  order?: number
  orders?: { order: number; zoneId: number }[]
  zones?: { zone: ZoneSI }[]
  sections?: SectionSI[]
}

export interface ZonesCategoriesSI {
  // fk
  zoneId: number
  categoryId: number

  id: number
  order: number

  // join
  categories: CategorySI
  category: CategorySI
}

export interface RestaurantSI {
  id: number
  name: string
  shortName?: string
}

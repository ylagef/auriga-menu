export enum EXTRA_SERVICES {
  BREAD = 'Servicio de pan 1,50€',
  GLUTEN_FREE_BREAD = 'Servicio de pan sin gluten 1,50€',
  RYE_BREAD = 'Opción de pan de centeno +1€',
  GLUTEN_FREE_BUN = 'Bollo sin gluten +1€'
}

export enum SCHEDULES {
  BREAKFAST = 'Horario de desayunos de 8:00 a 12:30',
  SNACK = 'Horario de meriendas de 17:00 a 20:00',
  UNINTERRUPTED = 'Cocina ininterrumpida de 8:00 a 23:30'
}

export enum ALLERGENS {
  CELERY = 'celery',
  CRUSTACEANS = 'crustaceans',
  EGG = 'egg',
  FISH = 'fish',
  GLUTEN = 'gluten',
  LACTOSE = 'lactose',
  LUPINS = 'lupins',
  MOLLUSCS = 'molluscs',
  MUSTARD = 'mustard',
  NUTS = 'nuts',
  PEELING_FRUITS = 'peeling_fruits',
  SESAME = 'sesame',
  SHELLFISH = 'shellfish',
  SOY = 'soy',
  SULPHITES = 'sulphites'
}

export interface Product {
  id: string
  name: string
  description?: string
  options?: string[]
  price: number | string // String for "S/M"
  allergens?: ALLERGENS[]
}

export interface Category {
  id: string
  label: string
  extraServices?: EXTRA_SERVICES[]
  products: Product[]
}

export interface Section {
  id: string
  buttonText: string
  sectionTitle?: string
  schedules?: string[]
  extraServices?: string[]
  categories?: Category[]
  products?: Product[]
}

export const GASTRO_SECTIONS: Section[] = [
  {
    id: 'menu',
    buttonText: 'Menú',
    sectionTitle: 'Menú del día'
  },
  {
    id: 'desayunos-meriendas',
    buttonText: 'Desayunos y meriendas',
    sectionTitle: 'Desayunos y meriendas',
    schedules: [SCHEDULES.BREAKFAST, SCHEDULES.SNACK],
    categories: [
      {
        id: 'clasicas',
        label: 'Clásicas',
        extraServices: [EXTRA_SERVICES.RYE_BREAD, EXTRA_SERVICES.GLUTEN_FREE_BUN],
        products: [
          {
            id: 'aove',
            name: 'De AOVE',
            price: 2,
            allergens: [ALLERGENS.GLUTEN]
          },
          {
            id: 'confitura-temporada-mantequilla',
            name: 'De confitura de temporada y mantequilla',
            price: 2.5,
            allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE]
          },
          {
            id: 'tomate-aove',
            name: 'De tomate restregado y AOVE',
            price: 3,
            allergens: [ALLERGENS.GLUTEN]
          }
        ]
      },
      {
        id: 'del-auriga',
        label: 'Las tostas del Auriga',
        products: [
          {
            id: 'mex',
            name: 'Taco mex,  guacamole, tartar de ahumados y queso galmesano',
            price: 6.5,
            allergens: [ALLERGENS.LACTOSE, ALLERGENS.FISH]
          },
          {
            id: 'centeno-requeson',
            name: 'Tosta de centeno, requesón, fruta de hueso a la parrilla, nueces y miel',
            price: 6.5,
            allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE, ALLERGENS.EGG]
          },
          {
            id: 'cea-huevos',
            name: 'Tosta de Cea, huevos BT, espinaca fresca y champiñones encurtidos',
            price: 6.5,
            allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE]
          }
        ]
      },
      {
        id: 'los-huevos',
        label: 'Los huevos',
        products: [
          {
            id: 'tortilla-patata',
            name: 'Tortilla de patata',
            description: 'Pintxo hecho al momento con pan con tomate',
            price: 3,
            allergens: [ALLERGENS.GLUTEN, ALLERGENS.EGG]
          },
          {
            id: 'croissant-huevo',
            name: 'Croissant a la plancha, huevos revueltos y jamón crujiente',
            price: 6.5,
            allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE, ALLERGENS.EGG, ALLERGENS.SULPHITES]
          },
          {
            id: 'benedictine',
            name: '63ºC con lacón',
            price: 7,
            allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE, ALLERGENS.EGG, ALLERGENS.SULPHITES]
          }
        ]
      }
    ]
  },
  {
    id: 'masas-panes',
    buttonText: 'Masas y panes',
    sectionTitle: 'Con pan y mucha miga',
    schedules: [SCHEDULES.UNINTERRUPTED]
  },
  {
    id: 'pintxos',
    buttonText: 'Pintxos',
    sectionTitle: 'Somos una ración',
    schedules: [SCHEDULES.UNINTERRUPTED],
    extraServices: [EXTRA_SERVICES.BREAD, EXTRA_SERVICES.GLUTEN_FREE_BREAD]
  },
  {
    id: 'raciones',
    buttonText: 'Raciones',
    schedules: [SCHEDULES.UNINTERRUPTED],
    extraServices: [EXTRA_SERVICES.BREAD, EXTRA_SERVICES.GLUTEN_FREE_BREAD]
  },
  {
    id: 'postres',
    buttonText: 'Postres',
    sectionTitle: 'Los dulces',
    schedules: [SCHEDULES.UNINTERRUPTED]
  },
  {
    id: 'recomendaciones',
    buttonText: 'Recomendaciones',
    sectionTitle: 'Lo que hoy nos inspira'
  },
  {
    id: 'vinos',
    buttonText: 'Vinos',
    sectionTitle: 'Vinos'
  },
  {
    id: 'cocteleria',
    buttonText: 'Coctelería',
    sectionTitle: 'Coctelería'
  }
]

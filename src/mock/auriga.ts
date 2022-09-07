import { SCHEDULES, EXTRA_SERVICES, ALLERGENS, Restaurant } from '../types'

export const RESTAURANT: Restaurant = {
  id: 'auriga',
  name: 'Auriga gastrobar',
  shortName: 'Auriga',
  zones: [
    {
      id: 'restaurante',
      name: 'Restaurante',
      sections: [
        {
          id: 'menu',
          order: 0,
          buttonText: 'Menú',
          sectionTitle: 'Menú del día',
          menu: {
            title: 'Menú del día',
            courses: [
              {
                id: 'aperitivos',
                name: 'Aperitivos',
                products: ['Mayonesa de naranja y zanahoria']
              },
              {
                id: 'entrantes',
                name: 'Entrantes',
                products: ['Ensalada de tomate y queso de cabra', 'Ensalada de quinoa y verduras']
              },
              {
                id: 'segundos-elegir',
                name: 'Segundos a elegir',
                products: ['Pasta con salsa de tomate y albahaca', 'Meiga a la brasa con patatas']
              },
              {
                id: 'postres',
                name: 'Postres',
                products: ['Tarta de queso']
              }
            ],
            extraServices: [EXTRA_SERVICES.BREAD_WATER_COFFEE],
            price: 12.9
          }
        },
        {
          id: 'desayunos-meriendas',
          order: 1,
          buttonText: 'Desayunos y meriendas',
          sectionTitle: 'Desayunos y meriendas',
          schedules: [SCHEDULES.BREAKFAST, SCHEDULES.SNACK],
          categories: [
            {
              id: 'clasicas',
              order: 0,
              title: 'Clásicas',
              extraServices: [EXTRA_SERVICES.RYE_BREAD, EXTRA_SERVICES.GLUTEN_FREE_BUN],
              products: [
                {
                  id: 'aove',
                  order: 0,
                  name: 'De AOVE',
                  price: 2,
                  allergens: [ALLERGENS.GLUTEN]
                },
                {
                  id: 'confitura-temporada-mantequilla',
                  order: 1,
                  name: 'De confitura de temporada y mantequilla',
                  price: 2.5,
                  allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE]
                },
                {
                  id: 'tomate-aove',
                  order: 2,
                  name: 'De tomate restregado y AOVE',
                  price: 3,
                  allergens: [ALLERGENS.GLUTEN]
                }
              ]
            },
            {
              id: 'del-auriga',
              order: 1,
              title: 'Las tostas del Auriga',
              products: [
                {
                  id: 'mex',
                  order: 0,
                  name: 'Taco mex,  guacamole, tartar de ahumados y queso galmesano',
                  price: 6.5,
                  allergens: [ALLERGENS.LACTOSE, ALLERGENS.FISH]
                },
                {
                  id: 'centeno-requeson',
                  order: 1,
                  name: 'Tosta de centeno, requesón, fruta de hueso a la parrilla, nueces y miel',
                  price: 6.5,
                  allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE, ALLERGENS.EGGS]
                },
                {
                  id: 'cea-huevos',
                  order: 2,
                  name: 'Tosta de Cea, huevos BT, espinaca fresca y champiñones encurtidos',
                  price: 6.5,
                  allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE]
                }
              ]
            },
            {
              id: 'los-huevos',
              order: 2,
              title: 'Los huevos',
              products: [
                {
                  id: 'tortilla-patata',
                  order: 0,
                  name: 'Tortilla de patata',
                  description: 'Pintxo hecho al momento con pan con tomate',
                  price: 3,
                  allergens: [ALLERGENS.GLUTEN, ALLERGENS.EGGS]
                },
                {
                  id: 'croissant-huevo',
                  order: 1,
                  name: 'Croissant a la plancha, huevos revueltos y jamón crujiente',
                  price: 6.5,
                  allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE, ALLERGENS.EGGS, ALLERGENS.SULPHITES]
                },
                {
                  id: 'benedictine',
                  order: 2,
                  name: '63ºC con lacón',
                  price: 7,
                  allergens: [ALLERGENS.GLUTEN, ALLERGENS.LACTOSE, ALLERGENS.EGGS, ALLERGENS.SULPHITES]
                }
              ]
            }
          ]
        },
        {
          id: 'masas-panes',
          order: 2,
          buttonText: 'Masas y panes',
          sectionTitle: 'Con pan y mucha miga',
          schedules: [SCHEDULES.UNINTERRUPTED],
          categories: []
        },
        {
          id: 'pintxos',
          order: 3,
          buttonText: 'Pintxos',
          sectionTitle: 'Somos una ración',
          schedules: [SCHEDULES.UNINTERRUPTED],
          extraServices: [EXTRA_SERVICES.BREAD, EXTRA_SERVICES.GLUTEN_FREE_BREAD],
          categories: []
        },
        {
          id: 'raciones',
          order: 4,
          buttonText: 'Raciones',
          schedules: [SCHEDULES.UNINTERRUPTED],
          extraServices: [EXTRA_SERVICES.BREAD, EXTRA_SERVICES.GLUTEN_FREE_BREAD],
          categories: []
        },
        {
          id: 'postres',
          order: 5,
          buttonText: 'Postres',
          sectionTitle: 'Los dulces',
          schedules: [SCHEDULES.UNINTERRUPTED],
          categories: []
        },
        {
          id: 'recomendaciones',
          order: 6,
          buttonText: 'Recomendaciones',
          sectionTitle: 'Lo que hoy nos inspira',
          categories: []
        },
        {
          id: 'vinos',
          order: 7,
          buttonText: 'Vinos',
          sectionTitle: 'Vinos',
          categories: []
        },
        {
          id: 'cocteleria',
          order: 8,
          buttonText: 'Coctelería',
          sectionTitle: 'Coctelería',
          categories: []
        }
      ]
    },
    {
      id: 'comedor',
      name: 'Comedor',
      sections: []
    }
  ]
}

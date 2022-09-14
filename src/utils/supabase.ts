import { createClient } from '@supabase/supabase-js'

import { CategorySI, CourseSI, MenuSI, ProductSI, RestaurantSI, SectionSI, ZonesCategoriesSI, ZoneSI } from './../typesSupabase'
import { getCookie } from './cookies'

// Create a single supabase client for interacting with your database
export const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_KEY)

const setAuthToken = () => {
  const token = getCookie('sup-access-token')
  supabase.auth.setAuth(token)
}

// Restaurant
export const getRestaurant = async ({ restaurantId }) => {
  const { data, error } = await supabase.from<RestaurantSI>('restaurants').select('*').eq('id', restaurantId).single()

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

// Zones
export const getZones = async ({ restaurantId }: { restaurantId: number }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('restaurantId', restaurantId)

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}
export const getZoneById = async ({ zoneId }: { zoneId: number }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('id', zoneId).single()

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

export const createZone = async ({ restaurantId, name, slug }: { restaurantId: number; name: string; slug: string }) => {
  setAuthToken()
  const { data, error } = await supabase.from<ZoneSI>('zones').insert([{ restaurantId, name, slug }])

  if (error) {
    console.error('error', error)
    return null
  }

  return data
}

// Categories
export const getZoneBySlug = async ({ restaurantId, zoneSlug }: { restaurantId: number; zoneSlug: string }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('restaurantId', restaurantId).eq('slug', zoneSlug).single()

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

export const getCategoryBySlug = async ({ categorySlug }: { categorySlug: string }) => {
  const { data, error } = await supabase.from<CategorySI>('categories').select('*').eq('slug', categorySlug).single()

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from<CategorySI>('categories')
    .select('*, zones:zones_categories(zone:zones (*)), orders:zones_categories(order)')

  if (error) {
    console.error('error', error)
    return null
  }

  return data
}

export const getCategoriesByZoneId = async ({ zoneId }: { zoneId: number }) => {
  // zones_categories is a junction table
  const { data, error } = await supabase
    .from<ZonesCategoriesSI>('zones_categories')
    .select('categoryId, order, categories ( * )')
    .eq('zoneId', zoneId)

  if (error) {
    console.error('error', error)
    return null
  }

  return data.map((d) => ({ ...d.categories, order: d.order }))
}

export const createCategory = async ({ zoneId, newCategory }: { zoneId: number; newCategory: CategorySI }) => {
  setAuthToken()
  const zoneCategories = await getCategoriesByZoneId({ zoneId })

  const { data, error } = await supabase.from<CategorySI>('categories').insert([
    {
      type: newCategory.type,
      slug: newCategory.slug,
      buttonText: newCategory.buttonText,
      categoryTitle: newCategory.categoryTitle,
      schedules: newCategory.schedules,
      extraServices: newCategory.extraServices
    }
  ])

  if (error) {
    console.error('error', error)
    return null
  }

  // ADD JOIN
  const order = zoneCategories.sort((a, b) => b.order - a.order)[0].order + 1

  const { data: data2, error: error2 } = await supabase
    .from<ZonesCategoriesSI>('zones_categories')
    .insert([{ zoneId, categoryId: data[0].id, order }])
  if (error2) {
    console.error('error', error2)
    return null
  }

  return data2
}

// Products
export const getProducts = async ({ categoryId, sectionId }: { categoryId?: number; sectionId?: number }) => {
  // TODO check if conditional is ok
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('categoryId', categoryId).eq('sectionId', sectionId)

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

export const getProductsByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('categoryId', categoryId)

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

export const getProductsBySection = async ({ sectionId }: { sectionId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('sectionId', sectionId)

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

export const createCategoryProduct = async ({ categoryId, newProduct }: { categoryId: number; newProduct: ProductSI }) => {
  setAuthToken()
  const { name, description, price, options, allergens, order } = newProduct
  const { data, error } = await supabase.from<ProductSI>('products').insert([{ categoryId, name, description, price, options, allergens, order }])

  if (error) {
    console.error('error', error)
    return null
  }

  return data
}

// Sections
export const getSections = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<SectionSI>('sections').select('*').eq('categoryId', categoryId)

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

export const getSectionsByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<SectionSI>('sections').select('*, products (*)').eq('categoryId', categoryId)

  if (error) {
    console.error('error', error)
    return null
  }
  console.log({ data })
  return data
}

export const createSection = async ({ categoryId, newSection }: { categoryId: number; newSection: SectionSI }) => {
  setAuthToken()
  const { title, extraServices, order } = newSection
  const { data, error } = await supabase.from<SectionSI>('sections').insert([{ categoryId, title, extraServices, order }])

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

// Menus
export const getMenus = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<MenuSI>('menus').select('*').eq('categoryId', categoryId)

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

export const getMenuByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<MenuSI>('menus').select('*').eq('categoryId', categoryId).single()

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

// Courses
export const getCourses = async ({ menuId }: { menuId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('menuId', menuId)

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

export const getCoursesByMenu = async ({ menuId }: { menuId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('menuId', menuId)

  if (error) {
    console.error('error', error)
    return null
  }
  return data
}

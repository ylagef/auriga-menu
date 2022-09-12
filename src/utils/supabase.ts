import { createClient } from '@supabase/supabase-js'

import { CategorySI, CourseSI, MenuSI, ProductSI, RestaurantSI, SectionSI, ZoneSI } from './../typesSupabase'

console.log({ url: import.meta.env.SUPABASE_URL, key: import.meta.env.SUPABASE_KEY })
// Create a single supabase client for interacting with your database
export const supabase = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY)

export const getRestaurant = async (id) => {
  const { data, error } = await supabase.from<RestaurantSI>('restaurants').select('*').eq('id', id).single()
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getZones = async ({ restaurantId }: { restaurantId: number }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('restaurantId', restaurantId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const createZone = async ({ restaurantId, name, slug }: { restaurantId: number; name: string; slug: string }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').insert([{ restaurantId, name, slug }])
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getZoneBySlug = async ({ restaurantId, zoneSlug }: { restaurantId: number; zoneSlug: string }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('restaurantId', restaurantId).eq('slug', zoneSlug).single()
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getCategories = async ({ zoneId }: { zoneId: number }) => {
  const { data, error } = await supabase.from<CategorySI>('categories').select('*').eq('zoneId', zoneId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getCategoryBySlug = async ({ categorySlug }: { categorySlug: string }) => {
  const { data, error } = await supabase.from<CategorySI>('categories').select('*').eq('slug', categorySlug).single()
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getCategoriesByZoneId = async ({ zoneId }: { zoneId: number }) => {
  const { data, error } = await supabase.from<CategorySI>('categories').select('*').eq('zoneId', zoneId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getProducts = async ({ categoryId, sectionId }: { categoryId?: number; sectionId?: number }) => {
  // TODO check if conditional is ok
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('categoryId', categoryId).eq('sectionId', sectionId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getProductsByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('categoryId', categoryId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getProductsBySection = async ({ sectionId }: { sectionId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('sectionId', sectionId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getSections = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<SectionSI>('sections').select('*').eq('categoryId', categoryId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getSectionsByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<SectionSI>('sections').select('*').eq('categoryId', categoryId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getMenus = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<MenuSI>('menus').select('*').eq('categoryId', categoryId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getMenuByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<MenuSI>('menus').select('*').eq('categoryId', categoryId).single()
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getCourses = async ({ menuId }: { menuId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('menuId', menuId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

export const getCoursesByMenu = async ({ menuId }: { menuId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('menuId', menuId)
  if (error) {
    console.log('error', error)
    return null
  }
  return data
}

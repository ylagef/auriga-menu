import { createClient } from '@supabase/supabase-js'

import { CategorySI, CourseSI, ProductSI, RestaurantSI, SectionSI, ZonesCategoriesSI, ZoneSI } from '../types'
import { getCookie } from './cookies'
import { handleSupabaseError } from './errors'

const RESTAURANT_ID = 1

// Create a single supabase client for interacting with your database
export const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_KEY)

const setAuthToken = () => {
  const token = getCookie('sup-access-token')
  supabase.auth.setAuth(token)
}

// Restaurant
export const getRestaurant = async () => {
  const { data, error } = await supabase.from<RestaurantSI>('restaurants').select('*').eq('id', RESTAURANT_ID).single()

  if (error) handleSupabaseError(error)

  return data
}

// Zones
export const getZones = async () => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('restaurantId', RESTAURANT_ID)

  if (error) handleSupabaseError(error)

  return data
}
export const getZoneById = async ({ zoneId }: { zoneId: number }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('id', zoneId).single()

  if (error) handleSupabaseError(error)

  return data
}

export const createZone = async ({ name, slug }: { name: string; slug: string }) => {
  setAuthToken()
  const { data, error } = await supabase.from<ZoneSI>('zones').insert([{ restaurantId: RESTAURANT_ID, name, slug }])

  if (error) handleSupabaseError(error)

  return data
}

export const updateZone = async ({ id, name, slug }: { id: number; name: string; slug: string }) => {
  setAuthToken()
  const { data, error } = await supabase.from<ZoneSI>('zones').update({ name, slug }).eq('restaurantId', RESTAURANT_ID).eq('id', id)

  if (error) handleSupabaseError(error)

  return data
}

export const getZoneBySlug = async ({ zoneSlug }: { zoneSlug: string }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('restaurantId', RESTAURANT_ID).eq('slug', zoneSlug).single()

  if (error) handleSupabaseError(error)

  return data
}

// Categories
export const getCategoryBySlug = async ({ categorySlug }: { categorySlug: string }) => {
  const { data, error } = await supabase
    .from<CategorySI>('categories')
    .select('*, zones:zones_categories(zone:zones(id)), orders:zones_categories(zoneId,order)')
    .eq('slug', categorySlug)
    .single()

  if (error) handleSupabaseError(error)

  return data
}

export const getCategoryById = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<CategorySI>('categories').select('*').eq('id', categoryId).single()

  if (error) handleSupabaseError(error)

  return data
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from<CategorySI>('categories')
    .select('*, zones:zones_categories(zone:zones (*)), orders:zones_categories(order)')

  if (error) handleSupabaseError(error)

  return data
}

export const getCategoriesByZoneId = async ({ zoneId }: { zoneId: number }) => {
  // zones_categories is a junction table
  const { data, error } = await supabase
    .from<ZonesCategoriesSI>('zones_categories')
    .select('categoryId, order, categories ( * )')
    .eq('zoneId', zoneId)

  if (error) handleSupabaseError(error)

  return data.map((d) => ({ ...d.categories, order: d.order }))
}

export const getCategoriesByZoneSlug = async ({ zoneSlug }: { zoneSlug: string }) => {
  const zone = await getZoneBySlug({ zoneSlug })

  const { data, error } = await supabase
    .from<ZonesCategoriesSI>('zones_categories')
    .select('order, category:categories ( id, buttonText, slug )')
    .eq('zoneId', zone.id)

  if (error) handleSupabaseError(error)

  return data.map((d) => ({ ...d.category, order: d.order }))
}

export const createCategory = async ({
  selectedZones,
  categoryObj,
  selectedZonesOrder
}: {
  selectedZones: number[]
  categoryObj: CategorySI
  selectedZonesOrder?: { zoneId: number; order: number }[]
}) => {
  setAuthToken()
  const { data: categoryData, error: categoryError } = await supabase.from<CategorySI>('categories').insert([categoryObj])

  if (categoryError) {
    console.error('supabase:createCategory', { categoryError })
    throw new Error(categoryError.code)
  }

  for (const zoneId of selectedZones) {
    const { error: zoneCategoryError } = await supabase
      .from<ZonesCategoriesSI>('zones_categories')
      .insert([{ zoneId, categoryId: categoryData[0].id, order: selectedZonesOrder?.find((szo) => szo.zoneId === zoneId)?.order }])
    if (zoneCategoryError) {
      console.error('supabase:createCategory', { zoneCategoryError })
      throw new Error(zoneCategoryError.code)
    }
  }

  return [categoryData]
}

export const updateCategory = async ({
  selectedZones,
  categoryObj,
  changesInZones,
  selectedZonesOrder
}: {
  selectedZones: number[]
  categoryObj: CategorySI
  changesInZones: boolean
  selectedZonesOrder?: { zoneId: number; order: number }[]
}) => {
  setAuthToken()
  const { error } = await supabase.from<CategorySI>('categories').update(categoryObj).eq('id', categoryObj.id)

  if (error) handleSupabaseError(error)

  if (changesInZones) {
    // Only if zones has changed

    const { data: categoryZonesData, error: categoryZonesErr } = await supabase
      .from<ZonesCategoriesSI>('zones_categories')
      .select('*')
      .eq('categoryId', categoryObj.id)

    if (categoryZonesErr) {
      console.error(`ERR! ${error.code}: ${error.message}`)
      throw new Error(error.code)
    }

    const filteredCategoryZones = categoryZonesData.filter((cz) => !selectedZones.includes(cz.id))

    for (const zoneCategory of filteredCategoryZones) {
      // Delete if not was selected and is not selected now
      const { error: deleteError } = await supabase.from<ZonesCategoriesSI>('zones_categories').delete().eq('id', zoneCategory.id)

      if (deleteError) {
        console.error(`ERR! ${error.code}: ${error.message}`)
        throw new Error(deleteError.code)
      }
    }

    const filteredSelectedZones = selectedZones.filter((sz) => !categoryZonesData.find((czd) => czd.id === sz))

    for (const zoneId of filteredSelectedZones) {
      // Create if was not selected and is selected now
      const { error: zoneCategoryError } = await supabase
        .from<ZonesCategoriesSI>('zones_categories')
        .insert([{ zoneId, categoryId: categoryObj.id, order: selectedZonesOrder?.find((szo) => szo.zoneId === zoneId)?.order }])

      if (zoneCategoryError) {
        console.error(`ERR! ${error.code}: ${error.message}`)
        throw new Error(zoneCategoryError.code)
      }
    }
  }
}

export const deleteCategoryById = async ({ category, sections }: { category: CategorySI; sections?: SectionSI[] }) => {
  setAuthToken()

  // If category has sections, delete sections
  if (sections) {
    for (const section of sections) {
      await deleteSectionById({ sectionId: section.id }) // Remove fk products
    }
  } else {
    await deleteProductsByFkId({ categoryId: category.id }) // Remove fk products
  }

  await deleteZoneCategoryByCategoryId({ categoryId: category.id }) // Remove fk zones_categories

  const { data, error } = await supabase.from<CategorySI>('categories').delete().eq('id', category.id)

  if (error) handleSupabaseError(error)

  return data
}

const deleteZoneCategoryByCategoryId = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<ZonesCategoriesSI>('zones_categories').delete().eq('categoryId', categoryId)

  if (error) handleSupabaseError(error)

  return data
}

// Products
export const getProductById = async ({ productId }: { productId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('id', productId).single()

  if (error) handleSupabaseError(error)

  return data
}

export const getProducts = async ({ categoryId, sectionId }: { categoryId?: number; sectionId?: number }) => {
  // TODO check if conditional is ok
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('categoryId', categoryId).eq('sectionId', sectionId)

  if (error) handleSupabaseError(error)

  return data
}

export const getProductsByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('categoryId', categoryId)

  if (error) handleSupabaseError(error)

  return data
}

export const getProductsBySection = async ({ sectionId }: { sectionId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('sectionId', sectionId)

  if (error) handleSupabaseError(error)

  return data
}

export const getSubsectionsBySection = async ({ sectionId }: { sectionId: number }) => {
  const { data, error } = await supabase.from<SectionSI>('sections').select('*').eq('parentSectionId', sectionId)

  if (error) handleSupabaseError(error)

  return data
}

export const createCategoryProduct = async ({ categoryId, productObj }: { categoryId: number; productObj: ProductSI }) => {
  setAuthToken()
  const { name, description, price, options, allergens, order } = productObj
  const { data, error } = await supabase.from<ProductSI>('products').insert([{ categoryId, name, description, price, options, allergens, order }])

  if (error) handleSupabaseError(error)

  return data
}

export const createSectionProduct = async ({ sectionId, productObj }: { sectionId: number; productObj: ProductSI }) => {
  setAuthToken()
  const { name, description, price, options, allergens, order } = productObj
  const { data, error } = await supabase.from<ProductSI>('products').insert([{ sectionId, name, description, price, options, allergens, order }])

  if (error) handleSupabaseError(error)

  return data
}

export const updateProduct = async ({ productObj }: { productObj: ProductSI }) => {
  setAuthToken()
  const { data, error } = await supabase.from<ProductSI>('products').update(productObj).eq('id', productObj.id)

  if (error) handleSupabaseError(error)

  return data
}

export const deleteProductById = async ({ productId }: { productId: number }) => {
  setAuthToken()
  const { data, error } = await supabase.from<ProductSI>('products').delete().eq('id', productId)

  if (error) handleSupabaseError(error)

  return data
}

const deleteProductsByFkId = async ({ sectionId, categoryId }: { sectionId?: number; categoryId?: number }) => {
  const { data, error } = await supabase
    .from<ProductSI>('products')
    .delete()
    .eq(sectionId ? 'sectionId' : 'categoryId', sectionId || categoryId)

  if (error) handleSupabaseError(error)

  return data
}

// Sections
export const getSections = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<SectionSI>('sections').select('*').eq('categoryId', categoryId)

  if (error) handleSupabaseError(error)

  return data
}

export const getSectionsByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase
    .from<SectionSI>('sections')
    .select('*, products ( * ), subsections:sections ( *, products ( * ) )')
    .eq('categoryId', categoryId)

  if (error) handleSupabaseError(error)

  return data
}

export const getSectionById = async ({ sectionId }: { sectionId: number }) => {
  const { data, error } = await supabase
    .from<SectionSI>('sections')
    .select('*, products ( * ), subsections:sections ( *, products ( * ) )')
    .eq('id', sectionId)
    .single()

  if (error) handleSupabaseError(error)

  return data
}

export const createSection = async ({
  parentSectionId,
  categoryId,
  sectionObj
}: {
  parentSectionId?: number
  categoryId?: number
  sectionObj: SectionSI
}) => {
  setAuthToken()
  const { title, extraServices, order, type } = sectionObj
  const { data, error } = await supabase.from<SectionSI>('sections').insert([{ parentSectionId, categoryId, title, extraServices, order, type }])

  if (error) handleSupabaseError(error)

  return data
}

export const deleteSectionById = async ({ sectionId }: { sectionId: number }) => {
  setAuthToken()
  await deleteProductsByFkId({ sectionId })

  const { data, error } = await supabase.from<SectionSI>('sections').delete().eq('id', sectionId)

  if (error) handleSupabaseError(error)

  return data
}

export const updateSection = async ({ sectionObj }: { sectionObj: SectionSI }) => {
  setAuthToken()
  const { data, error } = await supabase.from<SectionSI>('sections').update(sectionObj).eq('id', sectionObj.id)

  if (error) handleSupabaseError(error)

  return data
}

// Courses
export const getCourses = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('categoryId', categoryId)

  if (error) handleSupabaseError(error)

  return data
}

export const getCourseById = async ({ courseId }: { courseId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('id', courseId).single()

  if (error) handleSupabaseError(error)

  return data
}

export const getCoursesByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('categoryId', categoryId)

  if (error) handleSupabaseError(error)

  return data
}

export const createCourse = async ({ courseObj }: { courseObj: CourseSI }) => {
  setAuthToken()

  const { data, error } = await supabase.from<CourseSI>('courses').insert([courseObj])

  if (error) handleSupabaseError(error)

  return data
}

export const updateCourse = async ({ courseObj }: { courseObj: CourseSI }) => {
  setAuthToken()

  const { data, error } = await supabase.from<CourseSI>('courses').update(courseObj).eq('id', courseObj.id)

  if (error) handleSupabaseError(error)

  return data
}

export const deleteCourseById = async ({ courseId }: { courseId: number }) => {
  setAuthToken()

  const { data, error } = await supabase.from<CourseSI>('courses').delete().eq('id', courseId)

  if (error) handleSupabaseError(error)

  return data
}

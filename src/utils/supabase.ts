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
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

// Zones
export const getZones = async ({ restaurantId }: { restaurantId: number }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('restaurantId', restaurantId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}
export const getZoneById = async ({ zoneId }: { zoneId: number }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('id', zoneId).single()

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const createZone = async ({ restaurantId, name, slug }: { restaurantId: number; name: string; slug: string }) => {
  setAuthToken()
  const { data, error } = await supabase.from<ZoneSI>('zones').insert([{ restaurantId, name, slug }])

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }

  return data
}

export const updateZone = async ({ restaurantId, name, slug }: { restaurantId: number; name: string; slug: string }) => {
  setAuthToken()
  const { data, error } = await supabase.from<ZoneSI>('zones').update({ name, slug }).eq('restaurantId', restaurantId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }

  return data
}

// Categories
export const getZoneBySlug = async ({ restaurantId, zoneSlug }: { restaurantId: number; zoneSlug: string }) => {
  const { data, error } = await supabase.from<ZoneSI>('zones').select('*').eq('restaurantId', restaurantId).eq('slug', zoneSlug).single()

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getCategoryBySlug = async ({ categorySlug }: { categorySlug: string }) => {
  const { data, error } = await supabase
    .from<CategorySI>('categories')
    .select('*, zones:zones_categories(zone:zones(id)), orders:zones_categories(order)')
    .eq('slug', categorySlug)
    .single()

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getCategoryById = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<CategorySI>('categories').select('*').eq('id', categoryId).single()

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from<CategorySI>('categories')
    .select('*, zones:zones_categories(zone:zones (*)), orders:zones_categories(order)')

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
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
    console.error('error', { error })
    throw new Error(error.message)
  }

  return data.map((d) => ({ ...d.categories, order: d.order }))
}

export const createCategory = async ({ selectedZones, categoryObj }: { selectedZones: number[]; categoryObj: CategorySI }) => {
  setAuthToken()
  const { data: categoryData, error: categoryError } = await supabase.from<CategorySI>('categories').insert([
    {
      type: categoryObj.type,
      slug: categoryObj.slug,
      buttonText: categoryObj.buttonText,
      categoryTitle: categoryObj.categoryTitle,
      schedules: categoryObj.schedules,
      extraServices: categoryObj.extraServices
    }
  ])

  if (categoryError) {
    console.error('supabase:createCategory', { categoryError })
    throw new Error(categoryError.message)
  }

  selectedZones.forEach(async (zoneId) => {
    const zoneCategories = await getCategoriesByZoneId({ zoneId })
    const order = zoneCategories.sort((a, b) => b.order - a.order)[0].order + 1

    const { data: zoneCategoryData, error: zoneCategoryError } = await supabase
      .from<ZonesCategoriesSI>('zones_categories')
      .insert([{ zoneId, categoryId: categoryData[0].id, order }])
    if (zoneCategoryError) {
      console.error('supabase:createCategory', { zoneCategoryError })
      throw new Error(zoneCategoryError.message)
    }

    return [categoryData, zoneCategoryData]
  })
}

export const updateCategory = async ({ selectedZones, categoryObj }: { selectedZones: number[]; categoryObj: CategorySI }) => {
  setAuthToken()
  const { error } = await supabase.from<CategorySI>('categories').update(categoryObj).eq('id', categoryObj.id)

  if (error) {
    console.error('supabase:updateCategory', { error })
    throw new Error(error.message)
  }

  const { data: categoryZonesData, error: categoryZonesErr } = await supabase
    .from<ZonesCategoriesSI>('zones_categories')
    .select('*')
    .eq('categoryId', categoryObj.id)

  if (categoryZonesErr) {
    console.error('supabase:updateCategory', { categoryZonesErr })
    throw new Error(error.message)
  }

  categoryZonesData
    .filter((cz) => !selectedZones.includes(cz.id))
    .forEach(async (zoneCategory) => {
      // Delete if not was selected and is not selectednow
      const { error: deleteError } = await supabase.from<ZonesCategoriesSI>('zones_categories').delete().eq('id', zoneCategory.id)

      if (deleteError) {
        console.error('supabase:updateCategory', { deleteError })
        throw new Error(deleteError.message)
      }
    })

  selectedZones
    .filter((sz) => !categoryZonesData.find((czd) => czd.id === sz))
    .forEach(async (zoneId) => {
      // Create if was not selected and is selected now
      const { error: zoneCategoryError } = await supabase
        .from<ZonesCategoriesSI>('zones_categories')
        .insert([{ zoneId, categoryId: categoryObj.id, order: 99 }])

      if (zoneCategoryError) {
        console.error('supabase:updateCategory', { zoneCategoryError })
        throw new Error(zoneCategoryError.message)
      }
    })
}

export const deleteCategoryById = async ({ categoryId }: { categoryId: number }) => {
  setAuthToken()
  await deleteProductsByFkId({ categoryId }) // Remove fk products
  await deleteZoneCategoryByCategoryId({ categoryId }) // Remove fk zones_categories

  const { data, error } = await supabase.from<CategorySI>('categories').delete().eq('id', categoryId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

const deleteZoneCategoryByCategoryId = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<ZonesCategoriesSI>('zones_categories').delete().eq('categoryId', categoryId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

// Products
export const getProductById = async ({ productId }: { productId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('id', productId).single()

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getProducts = async ({ categoryId, sectionId }: { categoryId?: number; sectionId?: number }) => {
  // TODO check if conditional is ok
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('categoryId', categoryId).eq('sectionId', sectionId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getProductsByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('categoryId', categoryId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getProductsBySection = async ({ sectionId }: { sectionId: number }) => {
  const { data, error } = await supabase.from<ProductSI>('products').select('*').eq('sectionId', sectionId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const createCategoryProduct = async ({ categoryId, productObj }: { categoryId: number; productObj: ProductSI }) => {
  setAuthToken()
  const { name, description, price, options, allergens, order } = productObj
  const { data, error } = await supabase.from<ProductSI>('products').insert([{ categoryId, name, description, price, options, allergens, order }])

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }

  return data
}

export const createSectionProduct = async ({ sectionId, productObj }: { sectionId: number; productObj: ProductSI }) => {
  setAuthToken()
  const { name, description, price, options, allergens, order } = productObj
  const { data, error } = await supabase.from<ProductSI>('products').insert([{ sectionId, name, description, price, options, allergens, order }])

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }

  return data
}

export const updateProduct = async ({ productObj }: { productObj: ProductSI }) => {
  setAuthToken()
  console.log({ productObj })
  const { data, error } = await supabase.from<ProductSI>('products').update(productObj).eq('id', productObj.id)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }

  return data
}

export const deleteProductById = async ({ productId }: { productId: number }) => {
  setAuthToken()
  const { data, error } = await supabase.from<ProductSI>('products').delete().eq('id', productId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }

  return data
}

const deleteProductsByFkId = async ({ sectionId, categoryId }: { sectionId?: number; categoryId?: number }) => {
  const { data, error } = await supabase
    .from<ProductSI>('products')
    .delete()
    .eq(sectionId ? 'sectionId' : 'categoryId', sectionId || categoryId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }

  return data
}

// Sections
export const getSections = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<SectionSI>('sections').select('*').eq('categoryId', categoryId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getSectionsByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<SectionSI>('sections').select('*, products (*)').eq('categoryId', categoryId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  console.log({ data })
  return data
}

export const getSectionById = async ({ sectionId }: { sectionId: number }) => {
  const { data, error } = await supabase.from<SectionSI>('sections').select('*, products ( * )').eq('id', sectionId).single()

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const createSection = async ({ categoryId, sectionObj }: { categoryId: number; sectionObj: SectionSI }) => {
  setAuthToken()
  const { title, extraServices, order } = sectionObj
  const { data, error } = await supabase.from<SectionSI>('sections').insert([{ categoryId, title, extraServices, order }])

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const deleteSectionById = async ({ sectionId }: { sectionId: number }) => {
  setAuthToken()
  await deleteProductsByFkId({ sectionId })

  const { data, error } = await supabase.from<SectionSI>('sections').delete().eq('id', sectionId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }

  return data
}

export const updateSection = async ({ sectionObj }: { sectionObj: SectionSI }) => {
  setAuthToken()
  const { data, error } = await supabase.from<SectionSI>('sections').update(sectionObj).eq('id', sectionObj.id)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

// Menus
export const getMenus = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<MenuSI>('menus').select('*').eq('categoryId', categoryId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getMenuById = async ({ menuId }: { menuId: number }) => {
  const { data, error } = await supabase.from<MenuSI>('menus').select('*').eq('id', menuId).single()

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getMenuByCategory = async ({ categoryId }: { categoryId: number }) => {
  const { data, error } = await supabase.from<MenuSI>('menus').select('*, courses(*)').eq('categoryId', categoryId).single()

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

// Courses
export const getCourses = async ({ menuId }: { menuId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('menuId', menuId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getCourseById = async ({ courseId }: { courseId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('id', courseId).single()

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const getCoursesByMenu = async ({ menuId }: { menuId: number }) => {
  const { data, error } = await supabase.from<CourseSI>('courses').select('*').eq('menuId', menuId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const createCourse = async ({ courseObj }: { courseObj: CourseSI }) => {
  setAuthToken()

  const { data, error } = await supabase.from<CourseSI>('courses').insert([courseObj])

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const updateCourse = async ({ courseObj }: { courseObj: CourseSI }) => {
  setAuthToken()

  const { data, error } = await supabase.from<CourseSI>('courses').update(courseObj).eq('id', courseObj.id)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

export const deleteCourseById = async ({ courseId }: { courseId: number }) => {
  setAuthToken()

  const { data, error } = await supabase.from<CourseSI>('courses').delete().eq('id', courseId)

  if (error) {
    console.error('error', { error })
    throw new Error(error.message)
  }
  return data
}

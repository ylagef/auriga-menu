import React, { useEffect, useState } from 'react'
import { translations } from 'src/locales/translations'
import { CategorySI, CourseSI } from 'src/types'
import { getCoursesByCategory } from 'src/utils/supabase'

export default function MenuToPrint({ category }: { category: CategorySI }) {
  const [courses, setCourses] = useState<CourseSI[]>([])

  const fetchCourses = async () => {
    const courses = await getCoursesByCategory({ categoryId: category.id })
    setCourses(courses)
  }

  useEffect(() => {
    if (category) {
      fetchCourses()
    }
  }, [category])

  return (
    <div className="flex items-center justify-center h-[1050px] p-20">
      <div className="flex flex-col items-center justify-center gap-8 h-full w-full" id="print-container">
        <h1 className="text-center">{category.categoryTitle}</h1>

        {category.schedules?.length > 0 && (
          <div className="flex flex-col gap-1 py-4">
            {category.schedules.map((schedule) => (
              <small className="text-center">{translations.schedules[schedule]}</small>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {courses
            ?.sort((a, z) => a.order - z.order)
            .map((course) => (
              <div className="flex flex-col gap-2" key={course.id}>
                <h2 className="text-center">{course.name}</h2>

                <div className="flex flex-col gap-2 items-center">
                  {course.products.map((product) => (
                    <p className="text-center" key={product}>
                      {product}
                    </p>
                  ))}
                </div>
              </div>
            ))}

          <div className="flex flex-col gap-2 items-center">
            {category.extraServices?.map((extraService) => (
              <h5 className="text-center" key={extraService}>
                {translations.extraServices[extraService]}
              </h5>
            ))}
          </div>

          <h2 className="text-center text-3xl">{category.price}</h2>
        </div>
      </div>
    </div>
  )
}

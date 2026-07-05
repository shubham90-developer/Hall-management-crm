import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IStartersMenuCategory {
  _id: string
  categoryName: string
  status: string
  isDeleted: boolean
}

interface IStartersMenuCategoryResponse {
  message: string
  success: boolean
  statusCode: number
  data: IStartersMenuCategory | IStartersMenuCategory[]
}

export const startersMenuCategoryApi = createApi({
  reducerPath: 'startersMenuCategoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as IRootState)?.auth?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['StartersMenuCategory'],
  endpoints: (builder) => ({
    // get all
    getAllStartersMenuCategory: builder.query<IStartersMenuCategory[], void>({
      query: () => ({
        url: '/startes-menu-category',
        method: 'GET',
      }),
      transformResponse: (response: IStartersMenuCategoryResponse) => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['StartersMenuCategory'],
    }),

    // get by id
    getStartersMenuCategoryById: builder.query<IStartersMenuCategory, string>({
      query: (id) => ({
        url: `/startes-menu-category/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IStartersMenuCategoryResponse) => response.data as IStartersMenuCategory,
      providesTags: (result, error, id) => [{ type: 'StartersMenuCategory', id }],
    }),

    // create api
    createStartersMenuCategory: builder.mutation<IStartersMenuCategory, FormData>({
      query: (formData) => ({
        url: '/startes-menu-category',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IStartersMenuCategoryResponse) => response.data as IStartersMenuCategory,
      invalidatesTags: ['StartersMenuCategory'],
    }),

    // update api
    updateStartersMenuCategory: builder.mutation<IStartersMenuCategory, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/startes-menu-category/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IStartersMenuCategoryResponse) => response.data as IStartersMenuCategory,
      invalidatesTags: ['StartersMenuCategory'],
    }),

    // delete api
    deleteStartersMenuCategory: builder.mutation<IStartersMenuCategory, string>({
      query: (id) => ({
        url: `/startes-menu-category/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IStartersMenuCategoryResponse) => response.data as IStartersMenuCategory,
      invalidatesTags: ['StartersMenuCategory'],
    }),
  }),
})

export const {
  useGetAllStartersMenuCategoryQuery,
  useGetStartersMenuCategoryByIdQuery,
  useCreateStartersMenuCategoryMutation,
  useUpdateStartersMenuCategoryMutation,
  useDeleteStartersMenuCategoryMutation,
} = startersMenuCategoryApi

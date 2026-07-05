import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IMenuCategory {
  _id: string
  categoryName: string
  status: string
  isDeleted: boolean
}

interface IMenuCategoryResponse {
  message: string
  success: boolean
  statusCode: number
  data: IMenuCategory | IMenuCategory[]
}

export const menuCategoryApi = createApi({
  reducerPath: 'menuCategoryApi',
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
  tagTypes: ['MenuCategory'],
  endpoints: (builder) => ({
    // get all
    getAllMenuCategory: builder.query<IMenuCategory[], void>({
      query: () => ({
        url: '/menu-category',
        method: 'GET',
      }),
      transformResponse: (response: IMenuCategoryResponse) => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['MenuCategory'],
    }),

    // get by id
    getMenuCategoryById: builder.query<IMenuCategory, string>({
      query: (id) => ({
        url: `/menu-category/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IMenuCategoryResponse) => response.data as IMenuCategory,
      providesTags: (result, error, id) => [{ type: 'MenuCategory', id }],
    }),

    // create api
    createMenuCategory: builder.mutation<IMenuCategory, FormData>({
      query: (formData) => ({
        url: '/menu-category',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IMenuCategoryResponse) => response.data as IMenuCategory,
      invalidatesTags: ['MenuCategory'],
    }),

    // update api
    updateMenuCategory: builder.mutation<IMenuCategory, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/menu-category/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IMenuCategoryResponse) => response.data as IMenuCategory,
      invalidatesTags: ['MenuCategory'],
    }),

    // delete api
    deleteMenuCategory: builder.mutation<IMenuCategory, string>({
      query: (id) => ({
        url: `/menu-category/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IMenuCategoryResponse) => response.data as IMenuCategory,
      invalidatesTags: ['MenuCategory'],
    }),
  }),
})

export const {
  useGetAllMenuCategoryQuery,
  useGetMenuCategoryByIdQuery,
  useCreateMenuCategoryMutation,
  useUpdateMenuCategoryMutation,
  useDeleteMenuCategoryMutation,
} = menuCategoryApi

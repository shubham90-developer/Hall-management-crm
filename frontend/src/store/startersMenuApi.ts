import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

interface IStartersMenuCategory {
  _id: string
  categoryName: string
  status: string
  isDeleted: boolean
}

export interface IStartersMenu {
  _id: string
  categoryName: IStartersMenuCategory
  itemName: string
  price: string
  status: string
  isDeleted: boolean
}

interface IStartersMenuResponse {
  message: string
  success: boolean
  statusCode: number
  data: IStartersMenu | IStartersMenu[]
}

export const startersMenuApi = createApi({
  reducerPath: 'startersMenuApi',
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
  tagTypes: ['StartersMenu'],
  endpoints: (builder) => ({
    // get all
    getAllStartersMenu: builder.query<IStartersMenu[], void>({
      query: () => ({
        url: '/startes-menu',
        method: 'GET',
      }),
      transformResponse: (response: IStartersMenuResponse) => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['StartersMenu'],
    }),

    // get by id
    getStartersMenuById: builder.query<IStartersMenu, string>({
      query: (id) => ({
        url: `/startes-menu/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IStartersMenuResponse) => response.data as IStartersMenu,
      providesTags: (result, error, id) => [{ type: 'StartersMenu', id }],
    }),

    // create api
    createStartersMenu: builder.mutation<IStartersMenu, FormData>({
      query: (formData) => ({
        url: '/startes-menu',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IStartersMenuResponse) => response.data as IStartersMenu,
      invalidatesTags: ['StartersMenu'],
    }),

    // update api
    updateStartersMenu: builder.mutation<IStartersMenu, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/startes-menu/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IStartersMenuResponse) => response.data as IStartersMenu,
      invalidatesTags: ['StartersMenu'],
    }),

    // delete api
    deleteStartersMenu: builder.mutation<IStartersMenu, string>({
      query: (id) => ({
        url: `/startes-menu/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IStartersMenuResponse) => response.data as IStartersMenu,
      invalidatesTags: ['StartersMenu'],
    }),
  }),
})

export const {
  useGetAllStartersMenuQuery,
  useGetStartersMenuByIdQuery,
  useCreateStartersMenuMutation,
  useUpdateStartersMenuMutation,
  useDeleteStartersMenuMutation,
} = startersMenuApi

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

interface IBuffetName {
  _id: string
  buffetName: string
  createdAt?: string
  updatedAt?: string
}

export interface IOtherMenu {
  _id: string
  buffetName: IBuffetName[]
  itemName: string
  price: number
  status: string
}

interface IOtherMenuResponse {
  message: string
  success: boolean
  statusCode: number
  data: IOtherMenu | IOtherMenu[]
}

interface ICreateOtherMenu {
  buffetName: string[]
  itemName: string
  price: number
  status: string
}

export const otherMenuApi = createApi({
  reducerPath: 'otherMenuApi',

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

  tagTypes: ['otherMenuList'],

  endpoints: (builder) => ({
    getAllotherMenuList: builder.query<IOtherMenu[], void>({
      query: () => ({
        url: '/other-menu',
        method: 'GET',
      }),
      transformResponse: (response: IOtherMenuResponse): IOtherMenu[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['otherMenuList'],
    }),

    getotherMenuById: builder.query<IOtherMenu, string>({
      query: (id) => ({
        url: `/other-menu/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IOtherMenuResponse) => response.data as IOtherMenu,
      providesTags: (result, error, id) => [{ type: 'otherMenuList', id }],
    }),

    createotherMenu: builder.mutation<IOtherMenu, ICreateOtherMenu>({
      query: (data) => ({
        url: '/other-menu',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: IOtherMenuResponse) => response.data as IOtherMenu,
      invalidatesTags: ['otherMenuList'],
    }),

    updateotherMenu: builder.mutation<IOtherMenu, { id: string; data: ICreateOtherMenu }>({
      query: ({ id, data }) => ({
        url: `/other-menu/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IOtherMenuResponse) => response.data as IOtherMenu,
      invalidatesTags: ['otherMenuList'],
    }),

    deleteotherMenu: builder.mutation<IOtherMenu, string>({
      query: (id) => ({
        url: `/other-menu/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IOtherMenuResponse) => response.data as IOtherMenu,
      invalidatesTags: ['otherMenuList'],
    }),
  }),
})

export const {
  useGetAllotherMenuListQuery,
  useGetotherMenuByIdQuery,
  useCreateotherMenuMutation,
  useUpdateotherMenuMutation,
  useDeleteotherMenuMutation,
} = otherMenuApi

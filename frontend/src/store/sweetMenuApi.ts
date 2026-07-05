import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

interface IBuffetName {
  _id: string
  buffetName: string
  createdAt?: string
  updatedAt?: string
}

export interface ISweetMenu {
  _id: string
  buffetName: IBuffetName[]
  itemName: string
  price: number
  status: string
}

interface ISweetMenuResponse {
  message: string
  success: boolean
  statusCode: number
  data: ISweetMenu | ISweetMenu[]
}

export const sweetMenuApi = createApi({
  reducerPath: 'sweetMenuApi',

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

  tagTypes: ['sweetMenuList'],

  endpoints: (builder) => ({
    // Example: GET ALL
    getAllsweetMenuList: builder.query<ISweetMenu[], void>({
      query: () => ({
        url: '/sweet-menu',
        method: 'GET',
      }),

      transformResponse: (response: ISweetMenuResponse): ISweetMenu[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['sweetMenuList'],
    }),

    // get by id
    getsweetMenuById: builder.query<ISweetMenu, string>({
      query: (id) => ({
        url: `/sweet-menu/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ISweetMenuResponse) => response.data as ISweetMenu,
      providesTags: (result, error, id) => [{ type: 'sweetMenuList', id }],
    }),

    // create api
    createsweetMenu: builder.mutation<ISweetMenu, FormData>({
      query: (formData) => ({
        url: '/sweet-menu',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: ISweetMenuResponse) => response.data as ISweetMenu,
      invalidatesTags: ['sweetMenuList'],
    }),

    // update api
    updatesweetMenu: builder.mutation<ISweetMenu, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/sweet-menu/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ISweetMenuResponse) => response.data as ISweetMenu,
      invalidatesTags: ['sweetMenuList'],
    }),

    // delete api
    deletesweetMenu: builder.mutation<ISweetMenu, string>({
      query: (id) => ({
        url: `/sweet-menu/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ISweetMenuResponse) => response.data as ISweetMenu,
      invalidatesTags: ['sweetMenuList'],
    }),
  }),
})

export const {
  useGetsweetMenuByIdQuery,
  useGetAllsweetMenuListQuery,
  useCreatesweetMenuMutation,
  useUpdatesweetMenuMutation,
  useDeletesweetMenuMutation,
} = sweetMenuApi

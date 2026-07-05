import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IExternalItems {
  _id: string
  itemName: string
  buffet: { _id: string; buffetName: string } | string
  status: string
  isDeleted: boolean
}

interface IExternalItemsResponse {
  success: boolean
  statusCode: number
  message: string
  data: IExternalItems | IExternalItems[]
}

export const externalItemsApi = createApi({
  reducerPath: 'externalItemsApi',

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

  tagTypes: ['ExternalItems'],

  endpoints: (builder) => ({
    // GET ALL
    getAllExternalItems: builder.query<IExternalItems[], void>({
      query: () => ({
        url: '/external-list',
        method: 'GET',
      }),

      transformResponse: (response: IExternalItemsResponse): IExternalItems[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['ExternalItems'],
    }),

    // GET BY ID
    getAllExternalItemsById: builder.query<IExternalItems, string>({
      query: (id) => ({
        url: `/external-list/${id}`,
        method: 'GET',
      }),

      transformResponse: (response: IExternalItemsResponse) => response.data as IExternalItems,

      providesTags: (result, error, id) => [{ type: 'ExternalItems', id }],
    }),

    // create api
    createExternalItems: builder.mutation<IExternalItems, Partial<IExternalItems>>({
      query: (body) => ({
        url: '/external-list',
        method: 'POST',
        body,
      }),

      transformResponse: (response: IExternalItemsResponse) => response.data as IExternalItems,

      invalidatesTags: ['ExternalItems'],
    }),

    // update
    updateExternalItems: builder.mutation<IExternalItems, { id: string; data: Partial<IExternalItems> }>({
      query: ({ id, data }) => ({
        url: `/external-list/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: IExternalItemsResponse) => response.data as IExternalItems,

      invalidatesTags: ['ExternalItems'],
    }),

    // delete api

    deleteExternalItems: builder.mutation<IExternalItems | null, string>({
      query: (id) => ({
        url: `/external-list/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: IExternalItemsResponse) => (response?.data as IExternalItems) || null,

      invalidatesTags: ['ExternalItems'],
    }),
  }),
})

export const {
  useGetAllExternalItemsQuery,
  useGetAllExternalItemsByIdQuery,
  useCreateExternalItemsMutation,
  useUpdateExternalItemsMutation,
  useDeleteExternalItemsMutation,
} = externalItemsApi

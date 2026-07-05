import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IVegitables {
  _id: string
  vegitablesName: string
  status: string
  isDeleted: boolean
}

interface IVegitablesResponse {
  message: string
  success: boolean
  statusCode: number
  data: IVegitables | IVegitables[]
}

export const vegitablesApi = createApi({
  reducerPath: 'vegitablesApi',

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

  tagTypes: ['VegitablesList'],

  endpoints: (builder) => ({
    // Example: GET ALL
    getAllVegitablesList: builder.query<IVegitables[], void>({
      query: () => ({
        url: '/vegitables-list',
        method: 'GET',
      }),

      transformResponse: (response: IVegitablesResponse): IVegitables[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['VegitablesList'],
    }),

    // get by id
    getVegitablesById: builder.query<IVegitables, string>({
      query: (id) => ({
        url: `/vegitables-list/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IVegitablesResponse) => response.data as IVegitables,
      providesTags: (result, error, id) => [{ type: 'VegitablesList', id }],
    }),

    // create api
    createVegitables: builder.mutation<IVegitables, FormData>({
      query: (formData) => ({
        url: '/vegitables-list',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IVegitablesResponse) => response.data as IVegitables,
      invalidatesTags: ['VegitablesList'],
    }),

    // update api
    updateVegitables: builder.mutation<IVegitables, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/vegitables-list/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IVegitablesResponse) => response.data as IVegitables,
      invalidatesTags: ['VegitablesList'],
    }),

    // delete api
    deleteVegitables: builder.mutation<IVegitables, string>({
      query: (id) => ({
        url: `/vegitables-list/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IVegitablesResponse) => response.data as IVegitables,
      invalidatesTags: ['VegitablesList'],
    }),
  }),
})

export const {
  useGetAllVegitablesListQuery,
  useGetVegitablesByIdQuery,
  useCreateVegitablesMutation,
  useUpdateVegitablesMutation,
  useDeleteVegitablesMutation,
} = vegitablesApi

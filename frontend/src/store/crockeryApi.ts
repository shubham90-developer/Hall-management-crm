import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface ICrockery {
  _id: string
  crocekryName: string
  status: string
  isDeleted: boolean
}

interface ICrockeryResponse {
  message: string
  success: boolean
  statusCode: number
  data: ICrockery | ICrockery[]
}

export const crockeryApi = createApi({
  reducerPath: 'crockeryApi',

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

  tagTypes: ['CrockeryList'],

  endpoints: (builder) => ({
    // Example: GET ALL
    getAllCrockeryList: builder.query<ICrockery[], void>({
      query: () => ({
        url: '/crockery-list',
        method: 'GET',
      }),

      transformResponse: (response: ICrockeryResponse): ICrockery[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['CrockeryList'],
    }),

    // get by id
    getCrockeryById: builder.query<ICrockery, string>({
      query: (id) => ({
        url: `/crockery-list/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ICrockeryResponse) => response.data as ICrockery,
      providesTags: (result, error, id) => [{ type: 'CrockeryList', id }],
    }),

    // create api
    createCrockery: builder.mutation<ICrockery, FormData>({
      query: (formData) => ({
        url: '/crockery-list',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: ICrockeryResponse) => response.data as ICrockery,
      invalidatesTags: ['CrockeryList'],
    }),

    // update api
    updateCrockery: builder.mutation<ICrockery, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/crockery-list/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ICrockeryResponse) => response.data as ICrockery,
      invalidatesTags: ['CrockeryList'],
    }),

    // delete api
    deleteCrockery: builder.mutation<ICrockery, string>({
      query: (id) => ({
        url: `/crockery-list/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ICrockeryResponse) => response.data as ICrockery,
      invalidatesTags: ['CrockeryList'],
    }),
  }),
})

export const {
  useGetAllCrockeryListQuery,
  useGetCrockeryByIdQuery,
  useCreateCrockeryMutation,
  useUpdateCrockeryMutation,
  useDeleteCrockeryMutation,
} = crockeryApi

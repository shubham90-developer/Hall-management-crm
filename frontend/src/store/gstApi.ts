import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IGst {
  _id: string
  gst: number
  hallGst: number
  createdAt?: string
  updatedAt?: string
}

interface IGstResponse {
  success: boolean
  statusCode: number
  message: string
  data: IGst
}

export const gstApi = createApi({
  reducerPath: 'gstApi',

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

  tagTypes: ['Gst'],

  endpoints: (builder) => ({
    getGst: builder.query<IGst, void>({
      query: () => ({
        url: '/gst',
        method: 'GET',
      }),

      transformResponse: (response: IGstResponse): IGst => {
        return response.data
      },

      providesTags: ['Gst'],
    }),

    updateGst: builder.mutation<IGst, { gst: number; hallGst: number }>({
      query: (data) => ({
        url: '/gst',
        method: 'PATCH',
        body: data,
      }),

      transformResponse: (response: IGstResponse): IGst => {
        return response.data
      },

      invalidatesTags: ['Gst'],
    }),
  }),
})

export const { useGetGstQuery, useUpdateGstMutation } = gstApi

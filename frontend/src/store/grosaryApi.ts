import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IGrosary {
  _id: string
  grosaryName: string
  status: string
  isDeleted: boolean
}

interface IGrosaryResponse {
  message: string
  success: boolean
  statusCode: number
  data: IGrosary | IGrosary[]
}

export const grosaryApi = createApi({
  reducerPath: 'grosaryApi',

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

  tagTypes: ['GrosaryList'],

  endpoints: (builder) => ({
    // Example: GET ALL
    getAllGrosaryList: builder.query<IGrosary[], void>({
      query: () => ({
        url: '/grocery-list',
        method: 'GET',
      }),

      transformResponse: (response: IGrosaryResponse): IGrosary[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['GrosaryList'],
    }),

    // get by id
    getGrosaryById: builder.query<IGrosary, string>({
      query: (id) => ({
        url: `/grocery-list/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IGrosaryResponse) => response.data as IGrosary,
      providesTags: (result, error, id) => [{ type: 'GrosaryList', id }],
    }),

    // create api
    createGrosary: builder.mutation<IGrosary, FormData>({
      query: (formData) => ({
        url: '/grocery-list',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IGrosaryResponse) => response.data as IGrosary,
      invalidatesTags: ['GrosaryList'],
    }),

    // update api
    updateGrosary: builder.mutation<IGrosary, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/grocery-list/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IGrosaryResponse) => response.data as IGrosary,
      invalidatesTags: ['GrosaryList'],
    }),

    // delete api
    deleteGrosary: builder.mutation<IGrosary, string>({
      query: (id) => ({
        url: `/grocery-list/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IGrosaryResponse) => response.data as IGrosary,
      invalidatesTags: ['GrosaryList'],
    }),
  }),
})

export const { useGetAllGrosaryListQuery, useGetGrosaryByIdQuery, useCreateGrosaryMutation, useUpdateGrosaryMutation, useDeleteGrosaryMutation } =
  grosaryApi

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IOtherList {
  _id: string
  itemName: string
  price: string
  status: string
  isDeleted: boolean
}

interface IOtherListResponse {
  message: string
  success: boolean
  statusCode: number
  data: IOtherList | IOtherList[]
}

export const otherListApi = createApi({
  reducerPath: 'otherListApi',

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

  tagTypes: ['OtherList'],

  endpoints: (builder) => ({
    // Example: GET ALL
    getAllOtherList: builder.query<IOtherList[], void>({
      query: () => ({
        url: '/other-list',
        method: 'GET',
      }),

      transformResponse: (response: IOtherListResponse): IOtherList[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['OtherList'],
    }),

    // get by id
    getOtherListById: builder.query<IOtherList, string>({
      query: (id) => ({
        url: `/other-list/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IOtherListResponse) => response.data as IOtherList,
      providesTags: (result, error, id) => [{ type: 'OtherList', id }],
    }),

    // create api
    createOtherList: builder.mutation<IOtherList, FormData>({
      query: (formData) => ({
        url: '/other-list',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IOtherListResponse) => response.data as IOtherList,
      invalidatesTags: ['OtherList'],
    }),

    // update api
    updateOtherList: builder.mutation<IOtherList, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/other-list/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IOtherListResponse) => response.data as IOtherList,
      invalidatesTags: ['OtherList'],
    }),

    // delete api
    deleteOtherList: builder.mutation<IOtherList, string>({
      query: (id) => ({
        url: `/other-list/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IOtherListResponse) => response.data as IOtherList,
      invalidatesTags: ['OtherList'],
    }),
  }),
})

export const {
  useGetAllOtherListQuery,
  useGetOtherListByIdQuery,
  useCreateOtherListMutation,
  useUpdateOtherListMutation,
  useDeleteOtherListMutation,
} = otherListApi

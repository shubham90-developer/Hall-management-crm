import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IHallType {
  _id: string
  hallName: string
  status: string
  isDeleted: boolean
}

interface IHallTypeResponse {
  message: string
  success: boolean
  statusCode: number
  data: IHallType | IHallType[]
}

export const hallTypeApi = createApi({
  reducerPath: 'hallTypeApi',

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

  tagTypes: ['HallType'],

  endpoints: (builder) => ({
    // GET ALL
    getAllHallType: builder.query<IHallType[], void>({
      query: () => ({
        url: '/hall-type',
        method: 'GET',
      }),

      transformResponse: (response: IHallTypeResponse): IHallType[] => {
        return Array.isArray(response.data) ? response.data : response.data ? [response.data] : []
      },

      providesTags: ['HallType'],
    }),

    // get by id
    getHallTypeById: builder.query<IHallType, string>({
      query: (id) => ({
        url: `/hall-type/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IHallTypeResponse) => response.data as IHallType,
      providesTags: (result, error, id) => [{ type: 'HallType', id }],
    }),

    // create api
    createHallType: builder.mutation<IHallType, FormData>({
      query: (formData) => ({
        url: '/hall-type',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IHallTypeResponse) => response.data as IHallType,
      invalidatesTags: ['HallType'],
    }),

    // update api
    updateHallType: builder.mutation<IHallType, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/hall-type/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IHallTypeResponse) => response.data as IHallType,
      invalidatesTags: ['HallType'],
    }),

    // delete api

    deleteHallType: builder.mutation<IHallType, string>({
      query: (id) => ({
        url: `/hall-type/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IHallTypeResponse) => response.data as IHallType,
      invalidatesTags: ['HallType'],
    }),
  }),
})

export const { useGetAllHallTypeQuery, useGetHallTypeByIdQuery, useCreateHallTypeMutation, useUpdateHallTypeMutation, useDeleteHallTypeMutation } =
  hallTypeApi

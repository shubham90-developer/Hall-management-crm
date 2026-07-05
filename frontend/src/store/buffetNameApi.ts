import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IBuffetName {
  _id: string
  buffetName: string
  status: string
  isDeleted: boolean
}

interface IBuffetResponse {
  message: string
  success: boolean
  statusCode: number
  data: IBuffetName | IBuffetName[]
}

export const buffetNameApi = createApi({
  reducerPath: 'buffetNameApi',

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

  tagTypes: ['BuffetName'],

  endpoints: (builder) => ({
    // Example: GET ALL
    getAllBuggetName: builder.query<IBuffetName[], void>({
      query: () => ({
        url: '/buffet-name',
        method: 'GET',
      }),
      transformResponse: (response: IBuffetResponse): IBuffetName[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['BuffetName'],
    }),

    // get by id
    getBuffetNameById: builder.query<IBuffetName, string>({
      query: (id) => ({
        url: `/buffet-name/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IBuffetResponse) => response.data as IBuffetName,
      providesTags: (result, error, id) => [{ type: 'BuffetName', id }],
    }),

    // create api
    createBuffetName: builder.mutation<IBuffetName, FormData>({
      query: (formData) => ({
        url: '/buffet-name',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IBuffetResponse) => response.data as IBuffetName,
      invalidatesTags: ['BuffetName'],
    }),

    // update api
    updateBuffetName: builder.mutation<IBuffetName, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/buffet-name/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IBuffetResponse) => response.data as IBuffetName,
      invalidatesTags: ['BuffetName'],
    }),

    // delete api
    deleteBuffetName: builder.mutation<IBuffetName, string>({
      query: (id) => ({
        url: `/buffet-name/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IBuffetResponse) => response.data as IBuffetName,
      invalidatesTags: ['BuffetName'],
    }),
  }),
})

export const {
  useGetAllBuggetNameQuery,
  useGetBuffetNameByIdQuery,
  useCreateBuffetNameMutation,
  useUpdateBuffetNameMutation,
  useDeleteBuffetNameMutation,
} = buffetNameApi

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IFunctionType {
  _id: string
  functionName: string
  status: string
  isDeleted: boolean
}

interface IFunctionTypeResponse {
  success: boolean
  statusCode: number
  message: string
  data: IFunctionType | IFunctionType[]
}

export const functionTypeApi = createApi({
  reducerPath: 'functionTypeApi',

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

  tagTypes: ['FunctionType'],

  endpoints: (builder) => ({
    // GET ALL
    getAllFunctions: builder.query<IFunctionType[], void>({
      query: () => ({
        url: '/function-type',
        method: 'GET',
      }),

      transformResponse: (response: IFunctionTypeResponse): IFunctionType[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },

      providesTags: ['FunctionType'],
    }),

    // GET BY ID
    getAllFunctionById: builder.query<IFunctionType, string>({
      query: (id) => ({
        url: `/function-type/${id}`,
        method: 'GET',
      }),

      transformResponse: (response: IFunctionTypeResponse) => response.data as IFunctionType,

      providesTags: (result, error, id) => [{ type: 'FunctionType', id }],
    }),

    // create api
    createFunctionType: builder.mutation<IFunctionType, Partial<IFunctionType>>({
      query: (body) => ({
        url: '/function-type',
        method: 'POST',
        body,
      }),

      transformResponse: (response: IFunctionTypeResponse) => response.data as IFunctionType,

      invalidatesTags: ['FunctionType'],
    }),

    // update
    updateFunctionType: builder.mutation<IFunctionType, { id: string; data: Partial<IFunctionType> }>({
      query: ({ id, data }) => ({
        url: `/function-type/${id}`,
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: IFunctionTypeResponse) => response.data as IFunctionType,

      invalidatesTags: ['FunctionType'],
    }),

    // delete api

    deleteFunctionType: builder.mutation<IFunctionType | null, string>({
      query: (id) => ({
        url: `/function-type/${id}`,
        method: 'DELETE',
      }),

      transformResponse: (response: IFunctionTypeResponse) => (response?.data as IFunctionType) || null,

      invalidatesTags: ['FunctionType'],
    }),
  }),
})

export const {
  useGetAllFunctionsQuery,
  useGetAllFunctionByIdQuery,
  useCreateFunctionTypeMutation,
  useUpdateFunctionTypeMutation,
  useDeleteFunctionTypeMutation,
} = functionTypeApi

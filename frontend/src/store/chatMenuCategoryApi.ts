import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IChatMenuCategory {
  _id: string
  categoryName: string
  status: string
  isDeleted: boolean
}

interface IChatMenuCategoryResponse {
  message: string
  success: boolean
  statusCode: number
  data: IChatMenuCategory | IChatMenuCategory[]
}

export const chatMenuCategoryApi = createApi({
  reducerPath: 'chatMenuCategoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    fetchFn: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as IRootState)?.auth?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['ChatMenuCategory'],
  endpoints: (builder) => ({
    // get all
    getAllChatMenuCategory: builder.query<IChatMenuCategory[], void>({
      query: () => ({
        url: '/chat-menu-category',
        method: 'GET',
      }),
      transformResponse: (response: IChatMenuCategoryResponse) => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['ChatMenuCategory'],
    }),

    // get by id
    getChatMenuCategoryById: builder.query<IChatMenuCategory, string>({
      query: (id) => ({
        url: `/chat-menu-category/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IChatMenuCategoryResponse) => response.data as IChatMenuCategory,
      providesTags: (result, error, id) => [{ type: 'ChatMenuCategory', id }],
    }),

    // create api
    createChatMenuCategory: builder.mutation<IChatMenuCategory, { categoryName: string }>({
      query: (data) => ({
        url: '/chat-menu-category',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: IChatMenuCategoryResponse) => response.data as IChatMenuCategory,
      invalidatesTags: ['ChatMenuCategory'],
    }),

    // update api
    updateChatMenuCategory: builder.mutation<IChatMenuCategory, { id: string; data: { categoryName: string } }>({
      query: ({ id, data }) => ({
        url: `/chat-menu-category/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IChatMenuCategoryResponse) => response.data as IChatMenuCategory,
      invalidatesTags: ['ChatMenuCategory'],
    }),

    // delete api
    deleteChatMenuCategory: builder.mutation<IChatMenuCategory, string>({
      query: (id) => ({
        url: `/chat-menu-category/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IChatMenuCategoryResponse) => response.data as IChatMenuCategory,
      invalidatesTags: ['ChatMenuCategory'],
    }),
  }),
})

export const {
  useGetAllChatMenuCategoryQuery,
  useGetChatMenuCategoryByIdQuery,
  useCreateChatMenuCategoryMutation,
  useUpdateChatMenuCategoryMutation,
  useDeleteChatMenuCategoryMutation,
} = chatMenuCategoryApi

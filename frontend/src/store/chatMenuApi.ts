import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IChatMenu {
  _id: string
  categoryName: {
    _id: string
    categoryName: string
  }
  itemName: string
  price: string
  status: string
  isDeleted: boolean
}

interface IChatMenuResponse {
  message: string
  success: boolean
  statusCode: number
  data: IChatMenu | IChatMenu[]
}

export const chatMenuApi = createApi({
  reducerPath: 'chatMenuApi',

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

  tagTypes: ['ChatMenu'],

  endpoints: (builder) => ({
    getAllChatMenu: builder.query<IChatMenu[], void>({
      query: () => ({
        url: '/chat-menu',
        method: 'GET',
      }),
      transformResponse: (response: IChatMenuResponse): IChatMenu[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['ChatMenu'],
    }),

    getChatMenuById: builder.query<IChatMenu, string>({
      query: (id) => ({
        url: `/chat-menu/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IChatMenuResponse) => response.data as IChatMenu,
      providesTags: (result, error, id) => [{ type: 'ChatMenu', id }],
    }),

    createChatMenu: builder.mutation<IChatMenu, FormData>({
      query: (formData) => ({
        url: '/chat-menu',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IChatMenuResponse) => response.data as IChatMenu,
      invalidatesTags: ['ChatMenu'],
    }),

    updateChatMenu: builder.mutation<IChatMenu, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/chat-menu/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IChatMenuResponse) => response.data as IChatMenu,
      invalidatesTags: ['ChatMenu'],
    }),

    deleteChatMenu: builder.mutation<IChatMenu, string>({
      query: (id) => ({
        url: `/chat-menu/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IChatMenuResponse) => response.data as IChatMenu,
      invalidatesTags: ['ChatMenu'],
    }),
  }),
})

export const { useGetAllChatMenuQuery, useGetChatMenuByIdQuery, useCreateChatMenuMutation, useUpdateChatMenuMutation, useDeleteChatMenuMutation } =
  chatMenuApi

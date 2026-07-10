import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

interface IBuffetName {
  _id: string
  buffetName: string
  createdAt?: string
  updatedAt?: string
}

interface IMenuCategory {
  _id: string
  categoryName: string
  status: string
  isDeleted: boolean
}

interface ICrockery {
  _id: string
  crocekryName: string
  status: string
  isDeleted: boolean
}

interface IGrosary {
  _id: string
  grosaryName: string
  status: string
  isDeleted: boolean
}

interface IVegitables {
  _id: string
  vegitablesName: string
  status: string
  isDeleted: boolean
}

export interface IMenuList {
  _id: string
  buffetName: IBuffetName[]
  categoryName: IMenuCategory
  itemName: string
  crocekryName: ICrockery[]
  qty: string
  grosaryName: IGrosary[]
  vegitablesName: IVegitables[]
  menuImage?: string
  description?: string
  status: string
}

interface IMenuListResponse {
  message: string
  success: boolean
  statusCode: number
  data: IMenuList | IMenuList[]
}

export const MenuListApi = createApi({
  reducerPath: 'MenuListApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as IRootState)?.auth?.token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),

  tagTypes: ['MenuList'],

  endpoints: (builder) => ({
    // Example: GET ALL
    getAllMenuList: builder.query<IMenuList[], void>({
      query: () => ({
        url: '/menu-list',
        method: 'GET',
      }),

      transformResponse: (response: IMenuListResponse): IMenuList[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['MenuList'],
    }),

    // get by id
    getMenuListById: builder.query<IMenuList, string>({
      query: (id) => ({
        url: `/menu-list/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IMenuListResponse) => response.data as IMenuList,
      providesTags: (result, error, id) => [{ type: 'MenuList', id }],
    }),

    // create api
    createMenuList: builder.mutation<IMenuList, FormData>({
      query: (formData) => ({
        url: '/menu-list',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: IMenuListResponse) => response.data as IMenuList,
      invalidatesTags: ['MenuList'],
    }),

    // update api
    updateMenuList: builder.mutation<IMenuList, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/menu-list/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IMenuListResponse) => response.data as IMenuList,
      invalidatesTags: ['MenuList'],
    }),

    // delete api
    deleteMenuList: builder.mutation<IMenuList, string>({
      query: (id) => ({
        url: `/menu-list/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IMenuListResponse) => response.data as IMenuList,
      invalidatesTags: ['MenuList'],
    }),
  }),
})

export const { useGetAllMenuListQuery, useGetMenuListByIdQuery, useCreateMenuListMutation, useUpdateMenuListMutation, useDeleteMenuListMutation } =
  MenuListApi

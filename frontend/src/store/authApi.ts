import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'
import Cookies from 'js-cookie'

export interface IUser {
  _id: string
  username: string
  email: string
  logo: string
  secondaryLogo: string
  createdAt: string
  updatedAt: string
}

interface IAuthResponse {
  message: string
  success: boolean
  statusCode: number
  data: {
    user: IUser
    token: string
  }
}

interface ILoginInput {
  email: string
  password: string
}

interface IChangePasswordInput {
  username: string
  newPassword: string
}

export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as IRootState)?.auth?.token || Cookies.get('token') || ''

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<{ user: IUser; token: string }, ILoginInput>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: IAuthResponse) => ({
        user: response.data.user,
        token: response.data.token,
      }),
    }),

    changePassword: builder.mutation<void, IChangePasswordInput>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body: data,
      }),
    }),
    getMe: builder.query<IUser, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      transformResponse: (response: { data: IUser }) => response.data,
    }),
    updateLogo: builder.mutation<IUser, FormData>({
      query: (formData) => ({
        url: '/auth/logo',
        method: 'PATCH',
        body: formData,
      }),
      transformResponse: (response: { data: IUser }) => response.data,
    }),
    updateSecondaryLogo: builder.mutation<IUser, FormData>({
      query: (formData) => ({
        url: '/auth/secondary-logo',
        method: 'PATCH',
        body: formData,
      }),
      transformResponse: (response: { data: IUser }) => response.data,
    }),
  }),
})

export const { useUpdateSecondaryLogoMutation, useGetMeQuery, useLoginMutation, useChangePasswordMutation, useUpdateLogoMutation } = authApi

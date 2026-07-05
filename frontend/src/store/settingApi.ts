import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface ISetting {
  _id?: string
  currentPassword: string
  newPassword: string
}

interface ISettingResponse {
  message: string
  success: boolean
  statusCode: number
  data: ISetting
}

export const settingApi = createApi({
  reducerPath: 'settingApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://31.97.207.6:8090/v1/api',

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as IRootState)?.auth?.token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      headers.set('Content-Type', 'application/json')

      return headers
    },
  }),

  tagTypes: ['Setting'],

  endpoints: (builder) => ({
    // create setting
    createSetting: builder.mutation<ISetting, ISetting>({
      query: (data) => ({
        url: '/settings',
        method: 'POST',
        body: data,
      }),

      transformResponse: (response: ISettingResponse) => response.data,

      invalidatesTags: ['Setting'],
    }),

    // update setting
    updateSetting: builder.mutation<ISetting, ISetting>({
      query: (data) => ({
        url: '/settings',
        method: 'PUT',
        body: data,
      }),

      transformResponse: (response: ISettingResponse) => response.data,

      invalidatesTags: ['Setting'],
    }),
  }),
})

export const { useCreateSettingMutation, useUpdateSettingMutation } = settingApi

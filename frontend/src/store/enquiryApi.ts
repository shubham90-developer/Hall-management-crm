import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

interface IFunctionType {
  _id: string
  functionName: string
  status: string
  isDeleted: boolean
}

export interface IEnquiry {
  _id: string
  functionName: IFunctionType
  customerName: string
  mobileNo: string
  alternateMobileNo: string
  email: string
  date1?: string
  date2?: string
  date3?: string
  guestCount?: number
  notes?: string
  isJain: boolean
  status: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface IEnquiryResponse {
  message: string
  success: boolean
  statusCode: number
  data: IEnquiry | IEnquiry[]
}

interface ICreateEnquiry {
  customerName: string
  mobileNo: string
  alternateMobileNo?: string
  email?: string
  functionName: string
  date1?: string
  date2?: string
  date3?: string
  guestCount?: number
  notes?: string
  isJain: boolean
  status?: string
}

interface ISearchEnquiry {
  name?: string
  phone?: string
}

export const enquiryApi = createApi({
  reducerPath: 'enquiryApi',

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

  tagTypes: ['Enquiry'],

  endpoints: (builder) => ({
    getAllEnquiry: builder.query<IEnquiry[], void>({
      query: () => ({
        url: '/enquiry',
        method: 'GET',
      }),
      transformResponse: (response: IEnquiryResponse): IEnquiry[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['Enquiry'],
    }),

    getEnquiryById: builder.query<IEnquiry, string>({
      query: (id) => ({
        url: `/enquiry/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IEnquiryResponse) => response.data as IEnquiry,
      providesTags: (result, error, id) => [{ type: 'Enquiry', id }],
    }),

    // search by name or phone
    searchEnquiry: builder.query<IEnquiry | IEnquiry[], ISearchEnquiry>({
      query: ({ name, phone }) => {
        const params = new URLSearchParams()
        if (phone) params.append('phone', phone)
        if (name) params.append('name', name)
        return {
          url: `/enquiry/search?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response: IEnquiryResponse) => response.data,
    }),

    createEnquiry: builder.mutation<IEnquiry, ICreateEnquiry>({
      query: (data) => ({
        url: '/enquiry',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: IEnquiryResponse) => response.data as IEnquiry,
      invalidatesTags: ['Enquiry'],
    }),

    updateEnquiry: builder.mutation<IEnquiry, { id: string; data: ICreateEnquiry }>({
      query: ({ id, data }) => ({
        url: `/enquiry/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: IEnquiryResponse) => response.data as IEnquiry,
      invalidatesTags: ['Enquiry'],
    }),

    deleteEnquiry: builder.mutation<IEnquiry, string>({
      query: (id) => ({
        url: `/enquiry/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IEnquiryResponse) => response.data as IEnquiry,
      invalidatesTags: ['Enquiry'],
    }),
  }),
})

export const {
  useGetAllEnquiryQuery,
  useGetEnquiryByIdQuery,
  useLazySearchEnquiryQuery,
  useCreateEnquiryMutation,
  useUpdateEnquiryMutation,
  useDeleteEnquiryMutation,
} = enquiryApi

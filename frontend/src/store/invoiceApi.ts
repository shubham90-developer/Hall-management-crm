import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'
import { IBooking } from './bookingApi'

export interface IInvoice {
  _id: string
  invoiceNo: string
  booking: IBooking
  guests: number
  baseGuests: number
  totalAmount: number
  additionalAmount: number
  subtotalamount: number
  gst: number
  discount: number
  grandTotal: number
  finalAmount: number
  advance: number
  pendingAmount: number
  status: 'Active' | 'Cancelled'
  createdAt: string
  updatedAt: string
}

interface IInvoiceResponse {
  message: string
  success: boolean
  statusCode: number
  data: IInvoice | IInvoice[]
}

export interface ICreateInvoice {
  booking: string
  guests: number
  baseGuests?: number
  totalAmount: number
  additionalAmount: number
  gst: number
  discount: number
  advance: number
}

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as IRootState)?.auth?.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),

  tagTypes: ['Invoice'],

  endpoints: (builder) => ({
    getAllInvoices: builder.query<IInvoice[], void>({
      query: () => ({ url: '/invoice', method: 'GET' }),
      transformResponse: (response: IInvoiceResponse): IInvoice[] => (Array.isArray(response.data) ? response.data : [response.data]),
      providesTags: ['Invoice'],
    }),

    getInvoiceById: builder.query<IInvoice, string>({
      query: (id) => ({ url: `/invoice/${id}`, method: 'GET' }),
      transformResponse: (response: IInvoiceResponse) => response.data as IInvoice,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),

    createInvoice: builder.mutation<IInvoice, ICreateInvoice>({
      query: (data) => ({ url: '/invoice', method: 'POST', body: data }),
      transformResponse: (response: IInvoiceResponse) => response.data as IInvoice,
      invalidatesTags: ['Invoice'],
    }),

    updateInvoice: builder.mutation<IInvoice, { id: string; data: Partial<ICreateInvoice> }>({
      query: ({ id, data }) => ({ url: `/invoice/${id}`, method: 'PATCH', body: data }),
      transformResponse: (response: IInvoiceResponse) => response.data as IInvoice,
      invalidatesTags: ['Invoice'],
    }),

    cancelInvoice: builder.mutation<IInvoice, string>({
      query: (id) => ({ url: `/invoice/${id}/cancel`, method: 'PATCH' }),
      transformResponse: (response: IInvoiceResponse) => response.data as IInvoice,
      invalidatesTags: ['Invoice'],
    }),

    deleteInvoice: builder.mutation<IInvoice, string>({
      query: (id) => ({ url: `/invoice/${id}`, method: 'DELETE' }),
      transformResponse: (response: IInvoiceResponse) => response.data as IInvoice,
      invalidatesTags: ['Invoice'],
    }),
  }),
})

export const {
  useGetAllInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useCancelInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoiceApi

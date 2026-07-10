import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState as IRootState } from '@/store'

export interface IBooking {
  _id: string
  bookingNo?: string
  enquiry: {
    _id: string
    customerName: string
    mobileNo: string
    alternateMobileNo: string
    email: string
    date1?: string
    date2?: string
    date3?: string
    functionName: {
      _id: string
      functionName: string
    }
  }
  address: string
  gstNo?: string
  bookingDate: string
  functionDate: string
  functionType: {
    _id: string
    functionName: string
  }
  hall: {
    _id: string
    hallName: string
  }
  startTime: string
  endTime: string
  advance: number
  paymentMethod: string
  status: 'Confirmed' | 'Pencil' | 'Cancelled' | 'NB'

  Muhurat?: string
  guests?: number
  seatingArrangement?: string
  mealTime?: string | null
  menu?: string[]
  sweets?: string[]
  additional?: string[]
  externalItems?: string[]
  matchedItems?: string[]
  other?: { id: string; startTime: string; endTime: string }[]
  starters?: string[]
  chatMenu?: string[]
  menuType?: 'buffet' | 'starters' | 'chatmenu' | 'customize'
  selectedBuffetId?: string | { _id: string } | null
  totalAmount?: number
  additionalAmount?: number
  specialMenuAmount?: number
  subtotalamount?: number
  gst?: number

  grandTotal?: number
  discount?: number
  finalAmount?: number
  pendingAmount?: number
  hallAmount?: number
  cgst?: number
  sgst?: number
  hallFinalAmount?: number
  createdAt: string
  updatedAt: string
}

export interface IDayRequirementItem {
  name: string
  qty: number
  unit: string
}

export interface IDayRequirements {
  functionDate: string
  bookingsCount: number
  crockery: IDayRequirementItem[]
  grocery: IDayRequirementItem[]
  vegetables: IDayRequirementItem[]
}

interface IBookingResponse {
  message: string
  success: boolean
  statusCode: number
  data: IBooking | IBooking[]
}

interface ICreateBooking {
  enquiry: string
  address: string
  gstNo?: string
  bookingDate: string
  functionDate: string
  functionType: string
  hall: string
  startTime: string
  endTime: string
  advance: number
  paymentMethod: string
  status: 'Confirmed' | 'Pencil' | 'Cancelled' | 'NB'
}

interface IUpdateMenuBooking {
  Muhurat?: string
  guests?: number
  seatingArrangement?: string
  mealTime?: string | null
  menu?: string[]
  sweets?: string[]
  additional?: string[]
  externalItems?: string[]
  starters?: string[]
  chatMenu?: string[]
  menuType?: 'buffet' | 'starters' | 'chatmenu' | 'customize'
  selectedBuffetId?: string | null
  other?: { id: string; startTime: string; endTime: string }[]
}

interface IUpdatePricingBooking {
  totalAmount?: number
  additionalAmount?: number
  specialMenuAmount?: number
  subtotalamount?: number
  gst?: number
  discount?: number
  grandTotal?: number
  finalAmount?: number
  pendingAmount?: number
  hallAmount?: number
  cgst?: number
  sgst?: number
}

export const bookingApi = createApi({
  reducerPath: 'bookingApi',

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

  tagTypes: ['Booking'],

  endpoints: (builder) => ({
    getAllBookings: builder.query<IBooking[], void>({
      query: () => ({
        url: '/booking',
        method: 'GET',
      }),
      transformResponse: (response: IBookingResponse): IBooking[] => {
        return Array.isArray(response.data) ? response.data : [response.data]
      },
      providesTags: ['Booking'],
    }),

    getBookingById: builder.query<IBooking, string>({
      query: (id) => ({
        url: `/booking/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IBookingResponse) => response.data as IBooking,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    createBooking: builder.mutation<IBooking, ICreateBooking>({
      query: (data) => ({
        url: '/booking',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: IBookingResponse) => response.data as IBooking,
      invalidatesTags: ['Booking'],
    }),

    // step=basic
    updateBasicBooking: builder.mutation<IBooking, { id: string; data: Partial<ICreateBooking> }>({
      query: ({ id, data }) => ({
        url: `/booking/${id}?step=basic`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: IBookingResponse) => response.data as IBooking,
      invalidatesTags: ['Booking'],
    }),

    // step=menu
    updateMenuBooking: builder.mutation<IBooking, { id: string; data: IUpdateMenuBooking }>({
      query: ({ id, data }) => ({
        url: `/booking/${id}?step=menu`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: IBookingResponse) => response.data as IBooking,
      invalidatesTags: ['Booking'],
    }),

    // step=pricing
    updatePricingBooking: builder.mutation<IBooking, { id: string; data: IUpdatePricingBooking }>({
      query: ({ id, data }) => ({
        url: `/booking/${id}?step=pricing`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: IBookingResponse) => response.data as IBooking,
      invalidatesTags: ['Booking'],
    }),

    cancelBooking: builder.mutation<IBooking, string>({
      query: (id) => ({
        url: `/booking/${id}/cancel`,
        method: 'PATCH',
      }),
      transformResponse: (response: IBookingResponse) => response.data as IBooking,
      invalidatesTags: ['Booking'],
    }),

    deleteBooking: builder.mutation<IBooking, string>({
      query: (id) => ({
        url: `/booking/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: IBookingResponse) => response.data as IBooking,
      invalidatesTags: ['Booking'],
    }),
    getDayRequirements: builder.query<IDayRequirements, string>({
      query: (functionDate) => ({
        url: `/booking/day-requirements?functionDate=${functionDate}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['Booking'],
    }),
    getUpcomingExternalBookings: builder.query<IBooking[], void>({
      query: () => ({
        url: '/booking/upcoming-external',
        method: 'GET',
      }),
      transformResponse: (response: any) => (Array.isArray(response.data) ? response.data : [response.data]),
      providesTags: ['Booking'],
    }),
  }),
})

export const {
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBasicBookingMutation,
  useUpdateMenuBookingMutation,
  useUpdatePricingBookingMutation,
  useCancelBookingMutation,
  useDeleteBookingMutation,
  useGetUpcomingExternalBookingsQuery,
  useGetDayRequirementsQuery,
} = bookingApi

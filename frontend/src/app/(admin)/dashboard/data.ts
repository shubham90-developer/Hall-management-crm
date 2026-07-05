'use client'

import { useMemo } from 'react'

import { PageType, StatType } from './types'

import { useGetAllBookingsQuery } from '@/store/bookingApi'

export const useStateData = () => {
  const { data: bookings = [] } = useGetAllBookingsQuery()

  const allBookings = Array.isArray(bookings) ? bookings : []

  const totalNewBookings = allBookings.length

  const cancelledBookings = allBookings.filter((item) => item.status === 'Cancelled').length

  const pencilBookings = allBookings.filter((item) => item.status === 'Pencil').length

  const todaysFunctions = allBookings.filter((item) => {
    const bookingDate = new Date(item.bookingDate)
    const today = new Date()
    return (
      bookingDate.getDate() === today.getDate() && bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear()
    )
  }).length

  const totalCollection = allBookings.reduce((sum, item) => sum + Number(item.finalAmount || 0), 0)

  const receivedCollection = allBookings.reduce((sum, item) => sum + Number(item.advance || 0), 0)

  const pendingCollection = allBookings.reduce((sum, item) => sum + Number(item.pendingAmount || 0), 0)

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const stateData: StatType[] = useMemo(
    () => [
      {
        icon: 'solar:bookmark-square-bold-duotone',
        name: 'Total New Bookings',
        amount: String(totalNewBookings),
        variant: 'primary',
        change: '2.3',
        url: '/bookings',
      },
      {
        icon: 'bx:cross',
        name: 'Cancelled Bookings',
        amount: String(cancelledBookings),
        variant: 'danger',
        change: '8.1',
        url: '/bookings',
      },
      {
        icon: 'bx:pencil',
        name: 'Pencil Bookings',
        amount: String(pencilBookings),
        variant: 'secondary',
        change: '8.1',
        url: '/bookings',
      },
      {
        icon: 'bxs:backpack',
        name: 'Today’s Functions',
        amount: String(todaysFunctions),
        variant: 'success',
        change: '0.3',
        url: '/functions',
      },
      {
        icon: 'bx:dollar-circle',
        name: 'Total Collection',
        amount: formatCurrency(totalCollection),
        variant: 'info',
        change: '10.6',
        url: '/collections',
      },
      {
        icon: 'bx:dollar-circle',
        name: 'Received Collection',
        amount: formatCurrency(receivedCollection),
        variant: 'success',
        change: '10.6',
        url: '/collections',
      },
      {
        icon: 'bx:dollar-circle',
        name: 'Pending Collection',
        amount: formatCurrency(pendingCollection),
        variant: 'warning',
        change: '10.6',
        url: '/collections',
      },
    ],
    [totalNewBookings, cancelledBookings, pencilBookings, todaysFunctions, totalCollection, receivedCollection, pendingCollection],
  )

  return stateData
}

export const pagesList: PageType[] = [
  {
    path: 'larkon/ecommerce.html',
    views: 465,
    rate: '4.4',
    variant: 'success',
  },
  {
    path: 'larkon/dashboard.html',
    views: 426,
    rate: '20.4',
    variant: 'danger',
  },
]

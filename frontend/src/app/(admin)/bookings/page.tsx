import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AllBookings from './components/AllBookings'

export const metadata: Metadata = { title: 'All Bookings' }

const AllBookingsPage = () => {
  return (
    <>
      <PageTItle title="All Bookings" />
      <AllBookings />
    </>
  )
}

export default AllBookingsPage

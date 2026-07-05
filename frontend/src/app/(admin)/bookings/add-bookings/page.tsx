import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import AddBookings from './components/AddBookings'

export const metadata: Metadata = { title: 'Add Booking' }

const AddBookingsPage = () => {
  return (
    <>
      <PageTItle title="Add Booking" />
      <AddBookings />
    </>
  )
}

export default AddBookingsPage

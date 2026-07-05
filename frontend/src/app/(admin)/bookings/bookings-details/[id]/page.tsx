import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import BookingsDetails from '../components/BookingsDetails'

export const metadata: Metadata = { title: 'Booking Details' }

const BookingsDetailsPage = () => {
  return (
    <>
      <PageTItle title=" Booking Details" />
      <BookingsDetails />
    </>
  )
}

export default BookingsDetailsPage

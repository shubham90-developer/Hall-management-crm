import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import EnquiryList from './components/EnquiryList'

export const metadata: Metadata = { title: 'Enquiry List' }

const EnquiryListPage = () => {
  return (
    <>
      <PageTItle title="Enquiry List" />
      <EnquiryList />
    </>
  )
}

export default EnquiryListPage

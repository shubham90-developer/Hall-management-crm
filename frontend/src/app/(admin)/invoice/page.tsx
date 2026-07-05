import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import Invoices from './invices'
export const metadata: Metadata = { title: 'Invoices List' }

const InvoicesPage = () => {
  return (
    <>
      <PageTItle title="Invoices List" />
      <Invoices />
    </>
  )
}

export default InvoicesPage

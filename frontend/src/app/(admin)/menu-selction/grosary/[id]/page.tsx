import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import GrosaryPrint from '../components/GrosaryPrint'

export const metadata: Metadata = { title: 'Grosary Print' }

const GrosaryPrintPage = () => {
  return (
    <>
      <PageTItle title="Grosary Print" />
      <GrosaryPrint />
    </>
  )
}

export default GrosaryPrintPage

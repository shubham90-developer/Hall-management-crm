import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import VegetablesByDatePrint from './vegitables-print'
export const metadata: Metadata = { title: 'Vegetables Print' }

const VegetablesByDatePrintPage = () => {
  return (
    <>
      <PageTItle title="Vegetables Requirement Sheet" />
      <VegetablesByDatePrint />
    </>
  )
}

export default VegetablesByDatePrintPage

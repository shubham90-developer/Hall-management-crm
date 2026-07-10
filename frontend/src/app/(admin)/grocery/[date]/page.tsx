import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import GroceryPrint from './grocery-print'

export const metadata: Metadata = { title: 'Grocery Print' }

const GroceryPrintPage = () => {
  return (
    <>
      <PageTItle title="Grocery Requirement Sheet" />
      <GroceryPrint />
    </>
  )
}

export default GroceryPrintPage

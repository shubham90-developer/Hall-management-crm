import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import GroceryRequirements from './grocery'

export const metadata: Metadata = { title: 'Grocery Requirements' }

const GroceryRequirementsPage = () => {
  return (
    <>
      <PageTItle title="Grocery Requirements" />
      <GroceryRequirements />
    </>
  )
}

export default GroceryRequirementsPage

import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import VegetablesRequirements from './vegetables'
export const metadata: Metadata = { title: 'Vegetables Requirements' }

const VegetablesRequirementsPage = () => {
  return (
    <>
      <PageTItle title="Vegetables Requirements" />
      <VegetablesRequirements />
    </>
  )
}

export default VegetablesRequirementsPage

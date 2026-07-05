import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import VegitablesPrint from '../components/VegitablesPrint'

export const metadata: Metadata = { title: 'Vegitables Print' }

const VegitablesPrintPage = () => {
  return (
    <>
      <PageTItle title="Vegitables Print" />
      <VegitablesPrint />
    </>
  )
}

export default VegitablesPrintPage

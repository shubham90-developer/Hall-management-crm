import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import VegitablesList from './components/VegitablesList'

export const metadata: Metadata = { title: 'Vegitables List' }

const VegitablesListPage = () => {
  return (
    <>
      <PageTItle title="Vegitables List" />
      <VegitablesList />
    </>
  )
}

export default VegitablesListPage

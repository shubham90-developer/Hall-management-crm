import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import CrockeryList from './components/CrockeryList'

export const metadata: Metadata = { title: 'Crockery List' }

const CrockeryListPage = () => {
  return (
    <>
      <PageTItle title="Crockery List" />
      <CrockeryList />
    </>
  )
}

export default CrockeryListPage

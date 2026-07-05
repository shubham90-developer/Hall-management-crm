import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ExternalList from './components/ExternalList'

export const metadata: Metadata = { title: 'External Items' }

const ExternalListPage = () => {
  return (
    <>
      <PageTItle title="External Items" />
      <ExternalList />
    </>
  )
}

export default ExternalListPage

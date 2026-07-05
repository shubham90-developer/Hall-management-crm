import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import OtherList from './components/OtherList'

export const metadata: Metadata = { title: 'Other List' }

const OtherListPage = () => {
  return (
    <>
      <PageTItle title="Other List " />
      <OtherList />
    </>
  )
}

export default OtherListPage

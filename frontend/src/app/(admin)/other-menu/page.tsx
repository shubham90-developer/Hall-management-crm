import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import OtherMenu from './components/OtherMenu'

export const metadata: Metadata = { title: 'Other Menu List' }

const OtherMenuListPage = () => {
  return (
    <>
      <PageTItle title="Other Menu List " />
      <OtherMenu />
    </>
  )
}

export default OtherMenuListPage

import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import BuffetName from './components/BuffetName'

export const metadata: Metadata = { title: 'Buffet Category' }

const BuffetCategoryPage = () => {
  return (
    <>
      <PageTItle title="Buffet Category" />
      <BuffetName />
    </>
  )
}

export default BuffetCategoryPage

import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import SweetMenu from './components/SweetMenu'

export const metadata: Metadata = { title: 'Sweet Menu List' }

const SweetMenuListPage = () => {
  return (
    <>
      <PageTItle title="Sweet Menu List " />
      <SweetMenu />
    </>
  )
}

export default SweetMenuListPage

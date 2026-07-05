import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import RegularMenu from './components/RegularMenu'

export const metadata: Metadata = { title: 'Regular Menu' }

const RegularMenuPage = () => {
  return (
    <>
      <PageTItle title="Regular Menu " />
      <RegularMenu />
    </>
  )
}

export default RegularMenuPage

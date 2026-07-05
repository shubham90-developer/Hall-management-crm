import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import StartersMenu from './components/StartersMenu'

export const metadata: Metadata = { title: 'Starters Menu List' }

const StartersMenuListPage = () => {
  return (
    <>
      <PageTItle title="Starters Menu List " />
      <StartersMenu />
    </>
  )
}

export default StartersMenuListPage

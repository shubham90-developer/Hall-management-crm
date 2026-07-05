import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import SpecialMenu from './components/SpecialMenu'

export const metadata: Metadata = { title: 'Special Menu' }

const SpecialMenuPage = () => {
  return (
    <>
      <PageTItle title="Special Menu " />
      <SpecialMenu />
    </>
  )
}

export default SpecialMenuPage

import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import HallType from './components/HallType'

export const metadata: Metadata = { title: 'Hall Type' }

const HallTypePage = () => {
  return (
    <>
      <PageTItle title="Hall Type" />
      <HallType />
    </>
  )
}

export default HallTypePage

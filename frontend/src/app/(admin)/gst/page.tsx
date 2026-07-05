import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import GstSettings from './gst'

export const metadata: Metadata = { title: 'Hall Type' }

const HallTypePage = () => {
  return (
    <>
      <PageTItle title="GST" />
      <GstSettings />
    </>
  )
}

export default HallTypePage

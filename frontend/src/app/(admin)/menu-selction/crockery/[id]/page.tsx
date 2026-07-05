import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'

import CrockeryPrint from '../components/CrockeryPrint'

export const metadata: Metadata = { title: 'Crockery Print' }

const CrockeryPrintPage = () => {
  return (
    <>
      <PageTItle title="Crockery Print" />
      <CrockeryPrint />
    </>
  )
}

export default CrockeryPrintPage

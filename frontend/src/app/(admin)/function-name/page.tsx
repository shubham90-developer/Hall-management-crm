import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import FunctionName from './components/FunctionName'

export const metadata: Metadata = { title: 'Function Category' }

const FunctionNamePage = () => {
  return (
    <>
      <PageTItle title="Function Category" />
      <FunctionName />
    </>
  )
}

export default FunctionNamePage

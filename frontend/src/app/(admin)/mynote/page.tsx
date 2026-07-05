import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import MyTerms from './components/Terms'

export const metadata: Metadata = { title: 'Terms and Conditions' }

const TermsPage = () => {
  return (
    <>
      <PageTItle title="Terms and Conditions" />
      <MyTerms />
    </>
  )
}

export default TermsPage

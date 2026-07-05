import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import MenuSelectionDetails from '../components/MenuSelectionDetails'

export const metadata: Metadata = { title: 'Menu Selection Details' }

const MenuSelectionDetailsPage = () => {
  return (
    <>
      <PageTItle title="Menu Selection Details" />
      <MenuSelectionDetails />
    </>
  )
}

export default MenuSelectionDetailsPage

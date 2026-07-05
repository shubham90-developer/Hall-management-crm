import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import MenuSelection from './components/MenuSelection'

export const metadata: Metadata = { title: 'Menu Selection' }

const MenuSelectionPage = () => {
  return (
    <>
      <PageTItle title="Menu Selection" />
      <MenuSelection />
    </>
  )
}

export default MenuSelectionPage

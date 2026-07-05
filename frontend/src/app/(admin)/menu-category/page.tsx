import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import MenuCategory from './components/MenuCategory'

export const metadata: Metadata = { title: 'Menu Category' }

const MenuCategoryPage = () => {
  return (
    <>
      <PageTItle title="Menu Category" />
      <MenuCategory />
    </>
  )
}

export default MenuCategoryPage

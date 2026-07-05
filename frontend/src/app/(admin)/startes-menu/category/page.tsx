import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import StartersMenuCategory from './components/StartersMenuCategory'

export const metadata: Metadata = { title: 'Starters Menu Category List' }

const StartersMenuCategoryPage = () => {
  return (
    <>
      <PageTItle title="Starters Menu Category  List " />
      <StartersMenuCategory />
    </>
  )
}

export default StartersMenuCategoryPage

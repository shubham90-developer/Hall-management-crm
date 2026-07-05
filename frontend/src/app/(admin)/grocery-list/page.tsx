import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import GroceryList from './components/GroceryList'

export const metadata: Metadata = { title: 'Grocery List' }

const GroceryListPage = () => {
  return (
    <>
      <PageTItle title="Grocery List" />
      <GroceryList />
    </>
  )
}

export default GroceryListPage

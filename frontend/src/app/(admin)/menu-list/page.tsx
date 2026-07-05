import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import MenuList from './components/MenuList'

export const metadata: Metadata = { title: ' Menu List' }

const MenuListPage = () => {
  return (
    <>
      <PageTItle title=" Menu List" />
      <MenuList />
    </>
  )
}

export default MenuListPage

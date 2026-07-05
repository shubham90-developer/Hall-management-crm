import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ChatMenuCategory from './chat-menu'

export const metadata: Metadata = { title: 'Chat Menu Category List' }

const ChatMenuCategoryPage = () => {
  return (
    <>
      <PageTItle title="Chat Menu Category List " />
      <ChatMenuCategory />
    </>
  )
}

export default ChatMenuCategoryPage

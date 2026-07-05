import React from 'react'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'
import ChatMenu from './components/ChatMenu'

export const metadata: Metadata = { title: 'Chat Menu List' }

const ChatMenuListPage = () => {
  return (
    <>
      <PageTItle title="Chat Menu List " />
      <ChatMenu />
    </>
  )
}

export default ChatMenuListPage

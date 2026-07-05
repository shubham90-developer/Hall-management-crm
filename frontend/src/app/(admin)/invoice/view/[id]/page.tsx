'use client'
import { useParams } from 'next/navigation'
import ViewInvoice from '../../viewInvoice'
const Page = () => {
  const { id } = useParams()
  return <ViewInvoice invoiceId={id as string} />
}

export default Page

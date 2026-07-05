'use client'
import { useParams } from 'next/navigation'
import InvoicesDetails from '../components/InvoicesDetails'
const Page = () => {
  const { id } = useParams()
  return <InvoicesDetails bookingId={id as string} />
}

export default Page

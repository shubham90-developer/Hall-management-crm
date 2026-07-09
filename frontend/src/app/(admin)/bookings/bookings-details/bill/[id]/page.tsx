'use client'
import { useParams } from 'next/navigation'
import Bill from '../../components/bill'
const Page = () => {
  const { id } = useParams()
  return <Bill bookingId={id as string} />
}

export default Page

'use client'
import { useParams } from 'next/navigation'
import MenuPrint from '../components/PrintMenu'

const Page = () => {
  const { id } = useParams()
  return <MenuPrint bookingId={id as string} />
}

export default Page

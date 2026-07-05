'use client'
import { DateClickArg, Draggable } from '@fullcalendar/interaction'
import { EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core'
import { useEffect, useMemo, useState } from 'react'
import { useGetAllBookingsQuery } from '@/store/bookingApi'

const formatTime = (minutes: number | string) => {
  const totalMinutes = Number(minutes)
  const h24 = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const h = h24 % 12 || 12
  const ampm = h24 < 12 ? 'AM' : 'PM'
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`
}
const useCalendar = () => {
  const [show, setShow] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

  // ── Fetch all bookings ────────────────────────────────────────────
  const { data: bookings = [] } = useGetAllBookingsQuery()

  // ── Map bookings to calendar events ──────────────────────────────
  const events: EventInput[] = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const in3Days = new Date(today)
    in3Days.setDate(today.getDate() + 3)

    return bookings.map((booking) => {
      const bookingDate = new Date(booking.bookingDate)
      bookingDate.setHours(0, 0, 0, 0)

      const isPast = bookingDate < today
      const isNext3Days = bookingDate >= today && bookingDate <= in3Days
      const isUpcoming = bookingDate > in3Days

      let className = ''
      if (isPast) {
        className = 'bg-secondary text-white' // grey — past
      } else if (isNext3Days) {
        className = 'bg-warning text-dark' // yellow — next 3 days
      } else if (isUpcoming) {
        className = 'bg-success text-white' // green — upcoming
      }

      return {
        id: booking._id,
        title: `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)} | ${booking.hall.hallName}`,
        date: booking.bookingDate.split('T')[0],
        allDay: true,
        className,
        extendedProps: {
          status: booking.status,
          hall: booking.hall.hallName,
          startTime: booking.startTime,
          endTime: booking.endTime,
          customerName: booking.enquiry?.customerName ?? 'N/A',
          mobileNo: booking.enquiry?.mobileNo ?? '-',
        },
      }
    })
  }, [bookings])

  const onOpenModal = () => setShow(true)

  const onCloseModal = () => {
    setShow(false)
    setSelectedDate('')
    setSelectedBookingId(null)
    setIsEditable(false)
  }

  useEffect(() => {
    const draggableEl = document.getElementById('external-events')
    if (draggableEl) {
      new Draggable(draggableEl, { itemSelector: '.external-event' })
    }
  }, [])

  // ── Date click → new booking ──────────────────────────────────────
  const onDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr)
    setIsEditable(false)
    setSelectedBookingId(null)
    onOpenModal()
  }

  // ── Event click → edit booking ────────────────────────────────────
  const onEventClick = (arg: EventClickArg) => {
    setSelectedBookingId(String(arg.event.id))
    setSelectedDate('')
    setIsEditable(true)
    onOpenModal()
  }

  const onDrop = () => {}
  const onEventDrop = () => {}

  const createNewEvent = () => {
    setIsEditable(false)
    setSelectedBookingId(null)
    onOpenModal()
  }

  return {
    show,
    isEditable,
    selectedDate,
    selectedBookingId,
    events,
    onDateClick,
    onEventClick,
    onDrop,
    onEventDrop,
    onCloseModal,
    createNewEvent,
  }
}

export default useCalendar

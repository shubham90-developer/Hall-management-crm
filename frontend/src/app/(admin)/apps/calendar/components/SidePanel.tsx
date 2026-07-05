'use client'

import { Button } from 'react-bootstrap'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { EventInput } from '@fullcalendar/core'
import Link from 'next/link'

type Props = {
  createNewEvent: () => void
  events: EventInput[]
}

const SidePanel = ({ createNewEvent, events }: Props) => {
  return (
    <>
      <div className="d-flex flex-wrap gap-2">
        <Button variant="primary" type="button" onClick={createNewEvent}>
          <IconifyIcon icon="bx:plus" className="fs-18 me-2" />
          Add Booking
        </Button>

        <Link href="/bookings" className="btn btn-success">
          <IconifyIcon icon="bx:list-ul" className="fs-18 me-2" />
          View All Bookings
        </Link>

        <Link href="/menu-selction" className="btn btn-success">
          🍽️ Select Menu
        </Link>
      </div>

      <div id="external-events">
        <br />

        <p className="text-muted">All Events</p>

        {events?.map((event, index) => {
          const className = Array.isArray(event.className) ? event.className[0] : String(event.className || 'bg-primary')

          const color = className.replace('bg-', '')

          return (
            <div key={event.id || index} className={`external-event pb-1 bg-soft-${color} text-${color} mb-2`}>
              <span className="icons-center">
                <IconifyIcon icon="bxs:circle" className="me-2 vertical-middle" />

                {event.title}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default SidePanel

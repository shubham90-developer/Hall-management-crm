'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient'
import { useGetUpcomingExternalBookingsQuery } from '@/store/bookingApi'
import Link from 'next/link'
import { useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const Notifications = () => {
  const { data: bookings = [], isLoading } = useGetUpcomingExternalBookingsQuery(undefined, {
    pollingInterval: 60000, // re-fetch every 1 minute
  })

  // load dismissed IDs from localStorage on first render
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dismissed-notifications')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // only keep dismissed IDs that still exist in current bookings
  // this auto-cleans localStorage when bookings fall out of the 3-day window
  const validDismissed = dismissed.filter((id) => bookings.some((b) => b._id === id))

  const visible = bookings.filter((b) => !validDismissed.includes(b._id))

  const handleDelete = (id: string) => {
    const updated = [...validDismissed, id]
    setDismissed(updated)
    localStorage.setItem('dismissed-notifications', JSON.stringify(updated))
  }

  const handleClearAll = () => {
    const allIds = bookings.map((b) => b._id)
    setDismissed(allIds)
    localStorage.setItem('dismissed-notifications', JSON.stringify(allIds))
  }

  return (
    <Dropdown className="topbar-item">
      <DropdownToggle
        as={'a'}
        type="button"
        className="topbar-button position-relative content-none"
        id="page-header-notifications-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <IconifyIcon icon="solar:bell-bing-bold-duotone" className="fs-24 align-middle" />
        {visible.length > 0 && (
          <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">
            {visible.length}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </DropdownToggle>

      <DropdownMenu className="py-0 dropdown-lg dropdown-menu-end" aria-labelledby="page-header-notifications-dropdown">
        <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
          <Row className="align-items-center">
            <div className="col">
              <h6 className="m-0 fs-16 fw-semibold">Notifications</h6>
            </div>
            {visible.length > 0 && (
              <div className="col-auto">
                <Link
                  href=""
                  className="text-dark text-decoration-underline"
                  onClick={(e) => {
                    e.preventDefault()
                    handleClearAll()
                  }}>
                  <small>Clear All</small>
                </Link>
              </div>
            )}
          </Row>
        </div>

        <SimplebarReactClient style={{ maxHeight: 280 }}>
          {isLoading ? (
            <p className="p-3 text-muted mb-0">Loading...</p>
          ) : visible.length === 0 ? (
            <p className="p-3 text-muted mb-0">No upcoming notifications</p>
          ) : (
            visible.map((booking) => (
              <DropdownItem key={booking._id} className="py-3 border-bottom text-wrap">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex">
                    <div className="avatar-sm me-2">
                      <span className="avatar-title bg-soft-warning text-warning fs-20 rounded-circle">
                        <IconifyIcon icon="solar:box-bold-duotone" />
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-semibold">
                        बुकिंगची तारीख:{' '}
                        {new Date(booking.bookingDate).toLocaleDateString('mr-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="mb-0 text-muted text-wrap">{(booking.matchedItems || []).join(', ')} ची ऑर्डर झाली आहे का?</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-soft-danger ms-2 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation() // prevent dropdown from closing
                      handleDelete(booking._id)
                    }}>
                    <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" />
                  </button>
                </div>
              </DropdownItem>
            ))
          )}
        </SimplebarReactClient>

        <div className="text-center py-3">
          {/* <Link href="" className="btn btn-primary btn-sm">
            View All Notifications <i className="bx bx-right-arrow-alt ms-1" />
          </Link> */}
        </div>
      </DropdownMenu>
    </Dropdown>
  )
}

export default Notifications

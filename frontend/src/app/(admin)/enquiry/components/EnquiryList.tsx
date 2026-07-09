'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import AddEnquiryDrawer from './AddEnquiryDrawer'
import EditEnquiryDrawer from './EditEnquiryDrawer'
import { IEnquiry, useDeleteEnquiryMutation, useGetAllEnquiryQuery } from '@/store/enquiryApi'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const data = [
  {
    id: 1,
    customerName: 'Suraj Jamdade',
    mobile: '+91 9090909090',
    alternateMobile: '+91 9090909090',
    email: 'suraj@gmail.com',
    functionName: 'Engagement',
    enquiryDate: '28 May 2026',
  },
]

// maps status -> badge className, falls back to a neutral badge for old/blank data
const getStatusBadgeClass = (status?: string) => {
  switch (status) {
    case 'Confirmed':
      return 'badge-soft-success'
    case 'Hold':
      return 'badge-soft-danger'
    case 'Pending':
      return 'badge-soft-warning'
    default:
      return 'badge-soft-secondary'
  }
}

const EnquiryList = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const itemPerPage = 10

  const { data: enquiryData, isLoading, isError } = useGetAllEnquiryQuery()
  const [deleteEnquiryList] = useDeleteEnquiryMutation()

  // search
  const searchFunction = enquiryData?.filter((item: IEnquiry) => item.customerName?.toLowerCase().includes(search.toLowerCase())) || []
  // Pagination
  const startIndex = (page - 1) * itemPerPage
  const endIndex = startIndex + itemPerPage
  const currentItems = searchFunction.slice(startIndex, endIndex)

  const totalPages = Math.max(1, Math.ceil(searchFunction.length / itemPerPage))
  // Parses "DD/MM/YYYY, hh:mm:ss am/pm" safely, then formats it for display
  const formatEnquiryDate = (dateStr: string) => {
    if (!dateStr) return '—'

    // Split "12/6/2026, 10:10:30 am" -> ["12/6/2026", "10:10:30 am"]
    const [datePart, timePart] = dateStr.split(',').map((s) => s.trim())
    if (!datePart || !timePart) return dateStr // fallback, don't crash UI

    const [day, month, year] = datePart.split('/').map(Number)

    const timeMatch = timePart.match(/(\d+):(\d+):(\d+)\s*(am|pm)/i)
    if (!timeMatch) return dateStr

    let [, hourStr, minuteStr, secondStr, meridiem] = timeMatch
    let hour = Number(hourStr)
    const minute = Number(minuteStr)
    const second = Number(secondStr)

    if (meridiem.toLowerCase() === 'pm' && hour !== 12) hour += 12
    if (meridiem.toLowerCase() === 'am' && hour === 12) hour = 0

    // month - 1 because JS Date months are 0-indexed
    const parsedDate = new Date(year, month - 1, day, hour, minute, second)

    return parsedDate.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Simple event dates (date1/date2/date3) don't have a time component like createdAt,
  // so they're formatted separately and safely fall back when missing
  const formatSimpleDate = (dateStr?: string) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return null
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this  Enquiry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteEnquiryList(id).unwrap()
      toast.success('Enquiry deleted successfully')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (isLoading) {
    return <div>Loading....</div>
  }

  if (isError) {
    return <div>Error</div>
  }
  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4">All Enquiry List</CardTitle>
            <div className="d-flex gap-2 align-items-center">
              {/* SEARCH */}
              <div className="position-relative ms-2 d-none d-md-block">
                <input
                  type="search"
                  className="form-control form-control-sm ps-4"
                  placeholder="Search..."
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              </div>
              <AddEnquiryDrawer />
            </div>
          </div>

          <CardBody className="px-1 py-2">
            {/* Search */}
            <div className="position-relative ms-2 me-2 mb-4 d-block d-md-none">
              <input
                type="search"
                className="form-control form-control-sm ps-4"
                placeholder="Search..."
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
            </div>
            <Row className="g-4">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <Col xl={4} lg={6} md={6} sm={12} key={item._id}>
                    <div
                      className="card border-1 shadow-sm h-100 bg-light-subtle"
                      style={{
                        borderRadius: '22px',
                        overflow: 'hidden',
                      }}>
                      <div className=" border-1 shadow-sm h-100 bg-light-subtle" style={{ borderRadius: '22px', overflow: 'hidden' }}>
                        <div className="p-3">
                          {/* Header */}
                          <div className="d-flex align-items-start gap-3">
                            {/* Avatar */}
                            <div
                              className="d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{ width: 58, height: 58, borderRadius: 16, background: '#f2f2f2', fontSize: 20 }}>
                              👤
                            </div>
                            {/* Content */}
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                                {/* Left Side */}
                                <div className="flex-grow-1">
                                  <h5 className="fw-bold mb-2 text-break">{item.customerName}</h5>
                                  <div className="d-flex flex-wrap gap-1 mb-2">
                                    <div className="d-inline-flex align-items-center badge badge-soft-success px-2 py-1">
                                      <IconifyIcon icon="solar:confetti-minimalistic-bold" className="me-1" /> {item.functionName?.functionName}
                                    </div>
                                    <div className={`d-inline-flex align-items-center badge ${getStatusBadgeClass(item.status)} px-2 py-1`}>
                                      {item.status || 'Pending'}
                                    </div>
                                  </div>
                                  <p className="text-muted small mb-0">
                                    📅
                                    {formatEnquiryDate(item.createdAt)}
                                  </p>
                                  <div className="d-flex align-items-center fw-bold text-primary">
                                    <IconifyIcon icon="solar:letter-bold-duotone" className="me-2 fs-18 text-warning flex-shrink-0" />
                                    <span className="text-truncate" style={{ maxWidth: '100%' }}>
                                      {item.email.slice(0, 20)}...
                                    </span>
                                  </div>
                                </div>
                                {/* Right Side */}
                              </div>
                            </div>
                          </div>
                          {/* Event dates & guest count */}
                          {(item.date1 || item.date2 || item.date3 || item.guestCount) && (
                            <div className="mt-2 small text-muted">
                              {[item.date1, item.date2, item.date3]
                                .map((d) => formatSimpleDate(d))
                                .filter(Boolean)
                                .join(' · ')}
                              {item.guestCount ? (
                                <span className="ms-2">
                                  <IconifyIcon icon="solar:users-group-rounded-bold-duotone" className="me-1" />
                                  {item.guestCount} guests
                                </span>
                              ) : null}
                            </div>
                          )}
                          {item.notes && <p className="text-muted small mt-1 mb-0 text-truncate">📝 {item.notes}</p>}
                          {/* Footer */}
                          <div className="d-flex mt-3 justify-content-between gap-2">
                            <div className="d-flex align-items-center fw-bold text-dark">
                              <IconifyIcon icon="solar:phone-bold-duotone" className="me-2 fs-18 text-primary flex-shrink-0" />
                              <span className="text-break">{item.mobileNo.slice(0, 15)}</span>
                            </div>
                            <div className="d-flex align-items-center fw-bold text-dark">
                              <IconifyIcon icon="solar:phone-bold-duotone" className="me-2 fs-18 text-primary flex-shrink-0" />
                              <span className="text-break">{item.alternateMobileNo.slice(0, 15)}</span>
                            </div>
                          </div>
                          {/* Divider */} <div className="border-top my-2"></div>
                          <div className="d-flex justify-content-end gap-2 flex-shrink-0">
                            <EditEnquiryDrawer item={item} />
                            <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-16" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <div className="text-center py-5">
                    <h5 className="text-muted">No Enquiry Found</h5>
                  </div>
                </Col>
              )}
            </Row>
          </CardBody>

          <CardFooter className="border-top">
            <nav>
              <ul className="pagination justify-content-end mb-0">
                {/* PREVIOUS */}
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button type="button" className="page-link" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                    Previous
                  </button>
                </li>

                {/* PAGE */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1

                  return (
                    <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                      <button type="button" className="page-link" onClick={() => setPage(pageNumber)}>
                        {pageNumber}
                      </button>
                    </li>
                  )
                })}

                {/* NEXT */}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button type="button" className="page-link" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
}

export default EnquiryList

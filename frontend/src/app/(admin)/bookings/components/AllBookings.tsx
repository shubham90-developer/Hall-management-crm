'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { Card, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import { useGetAllBookingsQuery, useDeleteBookingMutation } from '@/store/bookingApi'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Swal from 'sweetalert2'
const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

const AllBookings = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: bookings = [], isLoading } = useGetAllBookingsQuery()
  const [deleteBooking] = useDeleteBookingMutation()

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })
    if (!result.isConfirmed) return
    try {
      await deleteBooking(id).unwrap()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter
    const matchesSearch = !search || b.enquiry?.customerName?.toLowerCase().includes(search.toLowerCase()) || b.enquiry?.mobileNo?.includes(search)
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const statusBadge = (status: string) => {
    if (status === 'Confirmed') return <span className="badge bg-success-subtle text-success">✅ {status}</span>
    if (status === 'Pencil') return <span className="badge bg-warning-subtle text-warning">✏️ {status}</span>
    if (status === 'Cancelled') return <span className="badge bg-danger-subtle text-danger">❌ {status}</span>
    return <span className="badge bg-secondary-subtle text-secondary">{status}</span>
  }

  const handleExportExcel = () => {
    const exportData = filtered.map((item, index) => ({
      'Booking No': `#${String(index + 1).padStart(3, '0')}`,
      'Customer Name': item.enquiry?.customerName || '--',
      Mobile: item.enquiry?.mobileNo || '--',
      'Alternate Mobile': item.enquiry?.alternateMobileNo || '--',
      Email: item.enquiry?.email || '--',
      Address: item.address || '--',
      'GST No': item.gstNo || '--',
      'Booking Date': item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('en-IN') : '--',
      Function: item.functionType?.functionName || '--',
      Hall: item.hall?.hallName || '--',
      'Start Time': item.startTime ? minutesToTime(Number(item.startTime)) : '--',
      'End Time': item.endTime ? minutesToTime(Number(item.endTime)) : '--',
      Status: item.status || '--',
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(data, `bookings-${new Date().toLocaleDateString('en-IN')}.xlsx`)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' })

    doc.setFontSize(16)
    doc.text('All Bookings', 14, 15)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 22)

    autoTable(doc, {
      startY: 28,
      head: [['#', 'Customer', 'Mobile', 'Email', 'Address', 'Booking Date', 'Function', 'Hall', 'Start', 'End', 'Status']],
      body: filtered.map((item, index) => [
        `#${String(index + 1).padStart(3, '0')}`,
        item.enquiry?.customerName || '--',
        item.enquiry?.mobileNo || '--',
        item.enquiry?.email || '--',
        item.address || '--',
        item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('en-IN') : '--',
        item.functionType?.functionName || '--',
        item.hall?.hallName || '--',
        item.startTime ? minutesToTime(Number(item.startTime)) : '--',
        item.endTime ? minutesToTime(Number(item.endTime)) : '--',
        item.status || '--',
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    })

    doc.save(`bookings-${new Date().toLocaleDateString('en-IN')}.pdf`)
  }
  return (
    <>
      <Row>
        <Col xl={12}>
          <Card>
            <div className="d-flex card-header justify-content-between align-items-center">
              <div>
                <CardTitle as={'h4'}>All Bookings List</CardTitle>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="position-relative ms-2 d-none d-md-block">
                  <input
                    type="search"
                    className="form-control form-control-sm ps-4"
                    placeholder="Search..."
                    autoComplete="off"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                  <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
                </div>

                {/* Filter */}
                <select
                  className="form-select form-select-sm w-auto"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}>
                  <option value="all">📊 All</option>
                  <option value="new">🆕 New</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="pencil">✏️ Pencil</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>

                {/* export */}
                <select
                  className="form-select form-select-sm w-auto d-none d-md-block"
                  value=""
                  onChange={(e) => {
                    if (e.target.value === 'excel') handleExportExcel()
                    if (e.target.value === 'pdf') handleExportPDF()
                  }}>
                  <option value="">📤 Export</option>
                  <option value="excel">📊 Excel</option>
                  <option value="pdf">📄 PDF</option>
                </select>
              </div>
            </div>

            <div>
              {/* Mobile Search */}
              <div className="position-relative ms-2 me-2 mb-4 mt-2 d-block d-md-none">
                <input
                  type="search"
                  className="form-control form-control-sm ps-4"
                  placeholder="Search..."
                  autoComplete="off"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                />
                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered table-bordered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th style={{ width: 20 }}>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="customCheck1" />
                          <label className="form-check-label" htmlFor="customCheck1" />
                        </div>
                      </th>
                      <th className="text-nowrap">Booking.No.</th>
                      <th className="text-nowrap">Customer Name</th>
                      <th className="text-nowrap">Mobile Number</th>
                      <th className="text-nowrap">Alternate Number</th>
                      <th className="text-nowrap">Email Address</th>
                      <th className="text-nowrap">Address</th>
                      <th className="text-nowrap">GST Number</th>
                      <th className="text-nowrap">Booking Date</th>
                      <th className="text-nowrap">Function Name</th>
                      <th className="text-nowrap">Selected Hall</th>
                      <th className="text-nowrap">Function Day & Date</th>
                      <th className="text-nowrap">Function Time From</th>
                      <th className="text-nowrap">Function Time To</th>
                      <th className="text-nowrap">Booking Type</th>
                      <th className="text-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={16} className="text-center py-4">
                          Loading...
                        </td>
                      </tr>
                    ) : paginated.length === 0 ? (
                      <tr>
                        <td colSpan={16} className="text-center py-4">
                          No bookings found
                        </td>
                      </tr>
                    ) : (
                      paginated.map((item, index) => (
                        <tr key={item._id}>
                          <td>
                            <div className="form-check">
                              <input type="checkbox" className="form-check-input" id={`booking-${item._id}`} />
                              <label className="form-check-label" htmlFor={`booking-${item._id}`}>
                                &nbsp;
                              </label>
                            </div>
                          </td>

                          <td className="text-nowrap">#{String((currentPage - 1) * itemsPerPage + index + 1).padStart(3, '0')}</td>

                          <td className="text-nowrap">👤 {item.enquiry?.customerName || '--'}</td>

                          <td className="text-nowrap">
                            <Link href={`tel:${item.enquiry?.mobileNo}`} className="text-primary">
                              📞 {item.enquiry?.mobileNo || '--'}
                            </Link>
                          </td>

                          <td className="text-nowrap">
                            <Link href={`tel:${item.enquiry?.alternateMobileNo}`} className="text-primary">
                              📞 {item.enquiry?.alternateMobileNo || '--'}
                            </Link>
                          </td>

                          <td className="text-nowrap">📧 {item.enquiry?.email || '--'}</td>
                          <td className="text-nowrap">🏡 {item.address || '--'}</td>
                          <td className="text-nowrap">🆔 {item.gstNo || '--'}</td>

                          <td className="text-nowrap">📅 {item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('en-IN') : '--'}</td>

                          <td className="text-nowrap bg-info-subtle text-dark fw-bold">🎉 {item.functionType?.functionName || '--'}</td>

                          <td className="text-nowrap bg-warning-subtle text-dark fw-bold">🏢 {item.hall?.hallName || '--'}</td>

                          <td className="text-nowrap bg-success-subtle text-dark fw-bold">
                            📆{' '}
                            {item.bookingDate
                              ? new Date(item.bookingDate).toLocaleDateString('en-IN', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })
                              : '--'}
                          </td>

                          <td className="text-nowrap">🕖 {item.startTime ? minutesToTime(Number(item.startTime)) : '--'}</td>
                          <td className="text-nowrap">🕖 {item.endTime ? minutesToTime(Number(item.endTime)) : '--'}</td>

                          <td className="text-nowrap">{statusBadge(item.status)}</td>

                          <td>
                            <div className="d-flex gap-2">
                              <Link href={`/bookings/bookings-details/${item._id}`} className="btn btn-soft-primary btn-sm">
                                <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                              </Link>

                              <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
                                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <CardFooter className="border-top">
              <nav>
                <ul className="pagination justify-content-end mb-0">
                  <li className={currentPage === 1 ? 'disabled' : ''}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={currentPage === page ? 'active' : ''}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>
                        {page}
                      </button>
                    </li>
                  ))}

                  <li className={currentPage === totalPages ? 'disabled' : ''}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AllBookings

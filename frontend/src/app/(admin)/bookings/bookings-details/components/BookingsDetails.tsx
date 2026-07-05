'use client'

import React from 'react'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'next/navigation'
import { useGetBookingByIdQuery, useDeleteBookingMutation } from '@/store/bookingApi'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

const BookingsDetails = () => {
  const { id } = useParams()
  const router = useRouter()

  const { data: booking, isLoading } = useGetBookingByIdQuery(id as string, { skip: !id })
  const [deleteBooking] = useDeleteBookingMutation()

  const handleDelete = async () => {
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
      await deleteBooking(id as string).unwrap()
      router.push('/bookings')
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-5">
        <h5 className="text-muted">Booking not found</h5>
        <Link href="/bookings" className="btn btn-light border mt-3">
          ← Back
        </Link>
      </div>
    )
  }

  const details = [
    { icon: '🆔', label: 'Booking Number', value: `#${booking.bookingNo || `#B????`.toUpperCase()}` },
    { icon: '👤', label: 'Customer Name', value: booking.enquiry?.customerName },
    { icon: '📞', label: 'Mobile Number', value: booking.enquiry?.mobileNo },
    { icon: '📱', label: 'Alternate Mobile', value: booking.enquiry?.alternateMobileNo },
    { icon: '📧', label: 'Email Address', value: booking.enquiry?.email },
    { icon: '🏠', label: 'Address', value: booking.address },
    { icon: '🧾', label: 'GST Number', value: booking.gstNo || '--' },
    {
      icon: '📅',
      label: 'Booking Date',
      value: booking.bookingDate
        ? new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : '--',
    },
    { icon: '🎉', label: 'Function Name', value: booking.functionType?.functionName },
    { icon: '🏢', label: 'Selected Hall', value: booking.hall?.hallName },
    {
      icon: '📆',
      label: 'Function Date',
      value: booking.bookingDate
        ? new Date(booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : '--',
    },
    {
      icon: '🕖',
      label: 'Function Time',
      value: booking.startTime && booking.endTime ? `${minutesToTime(Number(booking.startTime))} - ${minutesToTime(Number(booking.endTime))}` : '--',
    },
  ]

  const statusColor = booking.status === 'Confirmed' ? 'success' : booking.status === 'Pencil' ? 'warning' : 'danger'

  const statusIcon = booking.status === 'Confirmed' ? '✅' : booking.status === 'Pencil' ? '✏️' : '❌'

  return (
    <div className="container-fluid px-2 px-md-3">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">🎉 Booking Details</h3>
          <p className="text-muted mb-0">Complete booking information</p>
        </div>

        <Link href="/bookings" className="btn btn-light border">
          ← Back
        </Link>
      </div>

      <Row className="g-4">
        {/* Left Side */}
        <Col lg={8}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
              <h5 className="mb-0">👤 Customer Details</h5>
              <span className={`badge bg-${statusColor}-subtle text-${statusColor} px-3 py-2`}>
                {statusIcon} {booking.status}
              </span>
            </div>

            <div className="card-body">
              <Row className="g-3">
                {details.map((item, index) => (
                  <Col xl={4} md={6} xs={12} key={index}>
                    <div className="border rounded-3 p-3 h-100 bg-light-subtle">
                      <div className="text-muted small mb-2">
                        {item.icon} {item.label}
                      </div>
                      <h6 className="fw-bold mb-0 text-dark text-break" title={item.value}>
                        {item.value || '--'}
                      </h6>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Col>

        {/* Right Side */}
        <Col lg={4}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-header">
              <h5 className="mb-0">⚡ Quick Actions</h5>
            </div>

            <div className="card-body">
              <div className="d-grid gap-2">
                <Link href={`/invoices/invoices-details/${booking._id}`} className="btn btn-primary">
                  📄 Download Quotation
                </Link>

                {/* <button className="btn btn-success">💬 Send WhatsApp</button> */}

                <button className="btn btn-danger" onClick={handleDelete}>
                  🗑️ Delete Booking
                </button>
              </div>

              {/* Booking Summary */}
              <div className="mt-4 border-top pt-3">
                <h6 className="fw-bold mb-3">📋 Booking Summary</h6>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Status</span>
                  <span className={`fw-semibold text-${statusColor}`}>{booking.status}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Payment</span>
                  <span className="fw-semibold text-primary">{booking.paymentMethod || '--'}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Hall</span>
                  <span className="fw-semibold">{booking.hall?.hallName || '--'}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Advance</span>
                  <span className="fw-semibold">₹{booking.advance || 0}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Grand Total</span>
                  <span className="fw-semibold">₹{booking.grandTotal || 0}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="text-muted">Pending</span>
                  <span className="fw-semibold text-danger">₹{booking.pendingAmount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default BookingsDetails

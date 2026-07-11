'use client'

import React from 'react'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import AddGrosaryList from './AddGrosaryList'
import AddCrokeryList from './AddCrokeryList'
import { useGetBookingByIdQuery } from '@/store/bookingApi'
import { useState } from 'react'
import CrockeryListModal from '@/app/(admin)/crockery-list/components/CrockeryListModal'
interface Props {
  bookingId?: string
}

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

const MenuSelectionDetails = ({ bookingId }: Props) => {
  const { data: booking, isLoading } = useGetBookingByIdQuery(bookingId!, { skip: !bookingId })
  const [showCrockeryModal, setShowCrockeryModal] = useState(false)
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
        <h5 className="text-muted">No booking data found</h5>
      </div>
    )
  }

  const statusColor = booking.status === 'Confirmed' ? 'success' : booking.status === 'Pencil' ? 'warning' : 'danger'
  const statusIcon = booking.status === 'Confirmed' ? '✅' : booking.status === 'Pencil' ? '✏️' : '❌'

  const customerDetails = [
    { icon: '🆔', label: 'Booking Number', value: `#${booking.bookingNo || `#B????`.toUpperCase()}` },
    { icon: '👤', label: 'Customer Name', value: booking.enquiry?.customerName },
    { icon: '📞', label: 'Mobile Number', value: booking.enquiry?.mobileNo },
    { icon: '📞', label: 'Alternate Mobile Number', value: booking.enquiry?.alternateMobileNo },
    { icon: '🏠', label: 'Address', value: booking.address },
    { icon: '📧', label: 'Email Address', value: booking.enquiry?.email },
    { icon: '🧾', label: 'GST Number', value: booking.gstNo || '--' },
    {
      icon: '📅',
      label: 'Booking Date',
      value: booking.bookingDate
        ? new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : '--',
    },
    { icon: '🎉', label: 'Function Type', value: booking.functionType?.functionName },
    { icon: '⏰', label: 'Muhurat', value: booking.Muhurat || '--' },
    { icon: '👥', label: 'Meal Guests', value: booking.guests?.toString() || '--' },
    { icon: '🍽️', label: 'Meal Arrangement', value: booking.seatingArrangement || '--' },
    { icon: '🏢', label: 'Selected Hall', value: booking.hall?.hallName },
    {
      icon: '📆',
      label: 'Function Start Date',
      value: booking.bookingDate
        ? new Date(booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : '--',
    },
    {
      icon: '📆',
      label: 'Function End Date',
      value: booking.bookingDate
        ? new Date(booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : '--',
    },
    { icon: '🕖', label: 'Function Start Time', value: booking.startTime ? minutesToTime(Number(booking.startTime)) : '--' },
    { icon: '🕖', label: 'Function End Time', value: booking.endTime ? minutesToTime(Number(booking.endTime)) : '--' },
  ]

  // group menu items by categoryName
  const groupedMenu =
    (booking.menu as any[])?.reduce((acc: Record<string, any[]>, item: any) => {
      const cat = item.categoryName?.categoryName || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    }, {}) || {}

  const categoryIcons: Record<string, string> = {
    veg: '🥗',
    nonveg: '🍗',
    rice: '🍚',
    dal: '🍲',
    Other: '🍽️',
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* Left Side */}
          <div className="col-lg-8">
            {/* Customer Details */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between">
                <h5 className="mb-0">👤 Customer Details</h5>
                <span className={`badge bg-${statusColor}-subtle text-${statusColor} px-3 py-2`}>
                  {statusIcon} {booking.status}
                </span>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  {customerDetails.map((item, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="border rounded-3 p-3 h-100 bg-light-subtle">
                        <div className="text-muted small mb-2">
                          {item.icon} {item.label}
                        </div>
                        <h6 className="fw-bold mb-0 text-dark">{item.value || '--'}</h6>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Buffet Menu */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0 fw-bold">🍽️ Selected Menu</h5>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  {Object.keys(groupedMenu).length === 0 &&
                  (booking.sweets as any[])?.length === 0 &&
                  (booking.additional as any[])?.length === 0 &&
                  (booking.starters as any[])?.length === 0 &&
                  (booking.chatMenu as any[])?.length === 0 ? (
                    <div className="col-12 text-muted">No menu items selected</div>
                  ) : (
                    <>
                      {Object.entries(groupedMenu).map(([category, items]: [string, any[]], index) => (
                        <div className="col-md-6 col-lg-4" key={`buffet-${index}`}>
                          <div className="border rounded-3 p-2 h-100 bg-light-subtle">
                            <h6 className="fw-bold mb-3">
                              {categoryIcons[category] || '🍽️'} {category}
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                              {items.map((item: any, idx: number) => (
                                <span key={idx} className="badge bg-info-subtle text-dark border px-2 py-1 fw-medium">
                                  {item.itemName}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {(booking.sweets as any[])?.length > 0 && (
                        <div className="col-md-6 col-lg-4">
                          <div className="border rounded-3 p-2 h-100 bg-light-subtle">
                            <h6 className="fw-bold mb-3">🍰 Sweets</h6>
                            <div className="d-flex flex-wrap gap-2">
                              {(booking.sweets as any[]).map((item: any, idx: number) => (
                                <span key={idx} className="badge bg-info-subtle text-dark border px-2 py-1 fw-medium">
                                  {item.itemName} · ₹{item.price}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {(booking.additional as any[])?.length > 0 && (
                        <div className="col-md-6 col-lg-4">
                          <div className="border rounded-3 p-2 h-100 bg-light-subtle">
                            <h6 className="fw-bold mb-3">🍜 Additional</h6>
                            <div className="d-flex flex-wrap gap-2">
                              {(booking.additional as any[]).map((item: any, idx: number) => (
                                <span key={idx} className="badge bg-info-subtle text-dark border px-2 py-1 fw-medium">
                                  {item.itemName} · ₹{item.price}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {(booking.starters as any[])?.length > 0 && (
                        <div className="col-md-6 col-lg-4">
                          <div className="border rounded-3 p-2 h-100 bg-light-subtle">
                            <h6 className="fw-bold mb-3">🥗 Starters</h6>
                            <div className="d-flex flex-wrap gap-2">
                              {(booking.starters as any[]).map((item: any, idx: number) => (
                                <span key={idx} className="badge bg-info-subtle text-dark border px-2 py-1 fw-medium">
                                  {item.itemName} · ₹{item.price}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {(booking.chatMenu as any[])?.length > 0 && (
                        <div className="col-md-6 col-lg-4">
                          <div className="border rounded-3 p-2 h-100 bg-light-subtle">
                            <h6 className="fw-bold mb-3">🍜 Chat Menu</h6>
                            <div className="d-flex flex-wrap gap-2">
                              {(booking.chatMenu as any[]).map((item: any, idx: number) => (
                                <span key={idx} className="badge bg-info-subtle text-dark border px-2 py-1 fw-medium">
                                  {item.itemName} · ₹{item.price}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="col-lg-4">
            {/* Payment Summary */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">💰 Payment Summary</h5>
              </div>

              <div className="card-body">
                {/* Total Amount */}
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <h6 className="mb-0 fw-semibold">💰 Total Amount</h6>
                    <small className="text-muted">Base booking amount</small>
                  </div>
                  <span className="badge bg-success-subtle text-success px-3 py-2 fs-6">₹{booking.totalAmount || 0}</span>
                </div>

                {/* Additional Amount */}
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <h6 className="mb-0 fw-semibold">➕ Additional Amount</h6>
                    <small className="text-muted">Extra services & menu charges</small>
                  </div>
                  <span className="badge bg-primary-subtle text-primary px-3 py-2 fs-6">₹{booking.additionalAmount || 0}</span>
                </div>

                {/* GST */}
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <h6 className="mb-0 fw-semibold">🧾 GST</h6>
                    <small className="text-muted">State GST charge</small>
                  </div>
                  <span className="badge bg-warning-subtle text-dark px-3 py-2 fs-6">₹{booking.gst || 0}</span>
                </div>

                {/* Discount */}
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <h6 className="mb-0 fw-semibold">🎁 Discount</h6>
                    <small className="text-muted">Applied discount</small>
                  </div>
                  <span className="badge bg-danger-subtle text-danger px-3 py-2 fs-6">- ₹{booking.discount || 0}</span>
                </div>

                {/* Advance */}
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <h6 className="mb-0 fw-semibold">💵 Advance Paid</h6>
                    <small className="text-muted">Paid advance amount</small>
                  </div>
                  <span className="badge bg-info-subtle text-info px-3 py-2 fs-6">₹{booking.advance || 0}</span>
                </div>

                {/* Pending Amount */}
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <h6 className="mb-0 fw-semibold">⏳ Pending Amount</h6>
                    <small className="text-muted">Remaining payment</small>
                  </div>
                  <span className="badge bg-danger-subtle text-danger px-3 py-2 fs-6">₹{booking.pendingAmount || 0}</span>
                </div>

                {/* Grand Total */}
                <div className="d-flex justify-content-between align-items-center pt-4">
                  <div>
                    <h5 className="mb-0 fw-bold">🏆 Grand Total</h5>
                    <small className="text-muted">Final payable amount</small>
                  </div>
                  <span className="badge bg-success-subtle text-dark px-4 py-3 fs-5 shadow-sm">₹{booking.grandTotal || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">⚡ Quick Actions</h5>
              </div>

              <div className="card-body d-grid gap-3">
                <Link
                  href={`/invoices/invoices-details/${booking._id}`}
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2">
                  📄 <span>Download Quotation</span>
                </Link>

                <button
                  onClick={() => setShowCrockeryModal(true)}
                  className="btn btn-success d-flex align-items-center justify-content-center gap-2 py-2">
                  🍽️ <span>Download Crockery List</span>
                </button>

                {/* <Link
                href={`/menu-selction/grosary/${booking._id}`}
                className="btn btn-warning d-flex align-items-center justify-content-center gap-2 py-2">
                🛒 <span>Download Grocery List</span>
              </Link>

              <Link
                href={`/menu-selction/vegitables/${booking._id}`}
                className="btn btn-info text-white d-flex align-items-center justify-content-center gap-2 py-2">
                🥕 <span>Download Vegetable List</span>
              </Link> */}
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            {/* Menu Schedule — other items with startTime/endTime */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-bold mb-1">🍽️ Menu Schedule</h4>
                    <p className="text-muted small mb-0">Food menu timing and quantity details</p>
                  </div>
                  <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">{(booking.other as any[])?.length || 0} Menus</span>
                </div>
              </div>

              <div className="card-body pt-0">
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Menu Name</th>
                        <th>Price</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(booking.other as any[])?.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center text-muted">
                            No menu schedule added
                          </td>
                        </tr>
                      ) : (
                        (booking.other as any[])?.map((item: any, index: number) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                  style={{ width: 40, height: 40, fontSize: 18 }}>
                                  🍽️
                                </div>
                                <div>
                                  <h6 className="mb-0 fw-semibold">{item.id?.itemName || '--'}</h6>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-success-subtle text-success px-3 py-2">₹{item.id?.price || '--'}</span>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border px-3 py-2">⏰ {item.startTime || '--:--'}</span>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border px-3 py-2">⏰ {item.endTime || '--:--'}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CrockeryListModal show={showCrockeryModal} onHide={() => setShowCrockeryModal(false)} booking={booking} />
    </>
  )
}

export default MenuSelectionDetails

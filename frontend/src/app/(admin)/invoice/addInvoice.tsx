'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Alert, Card, CardBody, Col, Row } from 'react-bootstrap'
import { useLazySearchEnquiryQuery, IEnquiry } from '@/store/enquiryApi'
import { useGetAllBookingsQuery, IBooking } from '@/store/bookingApi'
import { useCreateInvoiceMutation } from '@/store/invoiceApi'
import InvoiceAmountDetails from './amountDetails'
type Step = 'search' | 'booking' | 'details'

const AddInvoiceDrawer = () => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('search')

  // ── Step 1: customer search ──────────────────────────────
  const [phone, setPhone] = useState('')
  const [searchName, setSearchName] = useState('')
  const [enquiryList, setEnquiryList] = useState<IEnquiry[]>([])
  const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiry | null>(null)
  const [searchEnquiry, { data: enquiryResult, isFetching: searching }] = useLazySearchEnquiryQuery()

  useEffect(() => {
    if (phone.length >= 3) searchEnquiry({ phone })
  }, [phone])

  useEffect(() => {
    if (searchName.length >= 3) searchEnquiry({ name: searchName })
  }, [searchName])

  useEffect(() => {
    if (!enquiryResult) return
    setEnquiryList(Array.isArray(enquiryResult) ? enquiryResult : [enquiryResult])
  }, [enquiryResult])

  // ── Step 2: their bookings ────────────────────────────────
  const { data: allBookings = [] } = useGetAllBookingsQuery(undefined, { skip: !open })
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null)

  const customerBookings = useMemo(() => {
    if (!selectedEnquiry) return []
    return allBookings.filter((b) => b.enquiry?._id === selectedEnquiry._id)
  }, [allBookings, selectedEnquiry])

  // ── Step 3: guests + pricing (same formula as quotation) ──
  const [guests, setGuests] = useState(0)
  const [advance, setAdvance] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [calculated, setCalculated] = useState({
    totalAmount: 0,
    additionalAmount: 0,
    subtotalamount: 0,
    gst: 0,
    grandTotal: 0,
    finalAmount: 0,
    pendingAmount: 0,
  })
  const [createInvoice, { isLoading: saving }] = useCreateInvoiceMutation()

  useEffect(() => {
    if (selectedBooking) {
      setGuests(selectedBooking.guests || 0)
      setAdvance(selectedBooking.advance || 0)
    }
  }, [selectedBooking])

  const reset = () => {
    setStep('search')
    setPhone('')
    setSearchName('')
    setEnquiryList([])
    setSelectedEnquiry(null)
    setSelectedBooking(null)
    setGuests(0)
    setAdvance(0)
    setDiscount(0)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  const handleSubmit = async () => {
    if (!selectedBooking) return
    if (guests <= 0) {
      toast.error('Please enter number of guests')
      return
    }
    try {
      await createInvoice({
        booking: selectedBooking._id,
        guests,
        totalAmount: calculated.totalAmount,
        additionalAmount: calculated.additionalAmount,
        gst: calculated.gst,
        discount,
        advance,
      }).unwrap()
      toast.success('Invoice created successfully')
      reset()
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create invoice')
    }
  }

  return (
    <>
      <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Invoice
      </button>

      {open && (
        <div
          onClick={() => {
            setOpen(false)
            reset()
          }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(3px)', zIndex: 1040 }}
        />
      )}

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '1100px',
          maxWidth: '100%',
          height: '100vh',
          background: '#f8fafc',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'all .35s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.12)',
        }}>
        <div
          className="d-flex align-items-center justify-content-between border-bottom"
          style={{ padding: '18px 24px', background: '#fff', flexShrink: 0 }}>
          <div>
            <h4 className="fw-bold mb-1">Create Invoice</h4>
            <p className="text-muted mb-0 small">
              {step === 'search' && 'Step 1: Search customer'}
              {step === 'booking' && 'Step 2: Select their booking'}
              {step === 'details' && 'Step 3: Guests & pricing'}
            </p>
          </div>
          <button
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => {
              setOpen(false)
              reset()
            }}>
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: 4 }}>
          <Row className="justify-content-center">
            <Col xxl={12}>
              <Card className="border-0" style={{ borderRadius: 24, boxShadow: '0 10px 35px rgba(0,0,0,0.05)' }}>
                <CardBody className="p-4 p-lg-5">
                  {/* STEP 1 — search customer */}
                  {step === 'search' && (
                    <>
                      <Row className="g-3 mb-4">
                        <Col md={6}>
                          <label className="form-label fw-semibold">Search by Mobile Number</label>
                          <input
                            type="text"
                            maxLength={10}
                            className="form-control form-control-lg"
                            placeholder="10 digit mobile number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          />
                        </Col>
                        <Col md={6}>
                          <label className="form-label fw-semibold">Search by Customer Name</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Type at least 3 letters"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                          />
                        </Col>
                      </Row>

                      {searching && <p className="text-muted">Searching...</p>}

                      <div className="d-flex flex-column gap-2">
                        {enquiryList.map((enq) => (
                          <div
                            key={enq._id}
                            onClick={() => {
                              setSelectedEnquiry(enq)
                              setStep('booking')
                            }}
                            className="p-3 border rounded-3 d-flex justify-content-between align-items-center"
                            style={{ cursor: 'pointer', background: '#fff' }}>
                            <div>
                              <div className="fw-semibold">{enq.customerName}</div>
                              <div className="text-muted small">
                                {enq.mobileNo} • {enq.functionName?.functionName}
                              </div>
                            </div>
                            <IconifyIcon icon="solar:alt-arrow-right-linear" />
                          </div>
                        ))}
                        {!searching && enquiryList.length === 0 && (phone.length === 10 || searchName.length >= 3) && (
                          <p className="text-muted">No customer found.</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* STEP 2 — pick booking */}
                  {step === 'booking' && selectedEnquiry && (
                    <>
                      <div className="mb-3 p-3 rounded-3" style={{ background: '#eff6ff' }}>
                        <div className="fw-semibold">{selectedEnquiry.customerName}</div>
                        <div className="text-muted small">{selectedEnquiry.mobileNo}</div>
                      </div>

                      <div className="d-flex flex-column gap-2">
                        {customerBookings.map((b) => (
                          <div
                            key={b._id}
                            onClick={() => {
                              setSelectedBooking(b)
                              setStep('details')
                            }}
                            className="p-3 border rounded-3 d-flex justify-content-between align-items-center"
                            style={{ cursor: 'pointer', background: '#fff' }}>
                            <div>
                              <div className="fw-semibold">{b.bookingNo}</div>
                              <div className="text-muted small">
                                {b.functionType?.functionName} • {new Date(b.bookingDate).toLocaleDateString('en-IN')} • {b.hall?.hallName}
                              </div>
                            </div>
                            <span className="badge bg-primary-subtle text-primary">{b.status}</span>
                          </div>
                        ))}
                        {customerBookings.length === 0 && <p className="text-muted">No bookings found for this customer.</p>}
                      </div>

                      <button className="btn btn-soft-danger btn-sm mt-3" onClick={() => setStep('search')}>
                        ⬅ Back to search
                      </button>
                    </>
                  )}

                  {/* STEP 3 — guests + pricing */}
                  {step === 'details' && selectedBooking && (
                    <>
                      <div className="mb-4 p-3 rounded-3" style={{ background: '#fff7ed' }}>
                        <Row>
                          <Col md={4}>
                            <div className="text-muted small">Customer</div>
                            <div className="fw-semibold">{selectedBooking.enquiry?.customerName}</div>
                          </Col>
                          <Col md={4}>
                            <div className="text-muted small">Booking No.</div>
                            <div className="fw-semibold">{selectedBooking.bookingNo}</div>
                          </Col>
                          <Col md={4}>
                            <div className="text-muted small">Function</div>
                            <div className="fw-semibold">{selectedBooking.functionType?.functionName}</div>
                          </Col>
                        </Row>
                      </div>

                      <InvoiceAmountDetails
                        booking={selectedBooking}
                        guests={guests}
                        onGuestsChange={setGuests}
                        advance={advance}
                        onAdvanceChange={setAdvance}
                        discount={discount}
                        onDiscountChange={setDiscount}
                        onCalculatedChange={setCalculated}
                      />

                      <button className="btn btn-light mt-2" onClick={() => setStep('booking')}>
                        ⬅ Back to bookings
                      </button>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        <div className="border-top bg-white" style={{ padding: 10, flexShrink: 0 }}>
          <div className="d-flex gap-3">
            <button
              className="btn btn-light w-100 py-2"
              onClick={() => {
                setOpen(false)
                reset()
              }}>
              Cancel
            </button>
            {step === 'details' && (
              <button
                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={handleSubmit}
                disabled={saving}>
                <IconifyIcon icon="solar:diskette-broken" />
                {saving ? 'Saving...' : 'Save Invoice'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AddInvoiceDrawer

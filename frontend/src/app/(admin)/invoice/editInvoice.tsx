'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Alert, Card, CardBody, Col, Row } from 'react-bootstrap'
import { IInvoice, useUpdateInvoiceMutation } from '@/store/invoiceApi'

import InvoiceAmountDetails from './amountDetails'
interface Props {
  invoice: IInvoice
}

const EditInvoiceDrawer = ({ invoice }: Props) => {
  const [open, setOpen] = useState(false)

  const [guests, setGuests] = useState(invoice.guests || 0)
  const [advance, setAdvance] = useState(invoice.advance || 0)
  const [discount, setDiscount] = useState(invoice.discount || 0)
  const [calculated, setCalculated] = useState({
    totalAmount: 0,
    additionalAmount: 0,
    subtotalamount: 0,
    gst: 0,
    grandTotal: 0,
    finalAmount: 0,
    pendingAmount: 0,
  })

  const [updateInvoice, { isLoading: saving }] = useUpdateInvoiceMutation()

  const booking = invoice.booking

  // reset form to this invoice's saved values whenever the drawer is (re)opened
  useEffect(() => {
    if (open) {
      setGuests(invoice.guests || 0)
      setAdvance(invoice.advance || 0)
      setDiscount(invoice.discount || 0)
    }
  }, [open, invoice])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  const handleSubmit = async () => {
    if (guests <= 0) {
      toast.error('Please enter number of guests')
      return
    }
    try {
      await updateInvoice({
        id: invoice._id,
        data: {
          guests,
          totalAmount: calculated.totalAmount,
          additionalAmount: calculated.additionalAmount,
          gst: calculated.gst,
          discount,
          advance,
        },
      }).unwrap()
      toast.success('Invoice updated successfully')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update invoice')
    }
  }

  return (
    <>
      <button className="btn btn-soft-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
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
            <h4 className="fw-bold mb-1">Edit Invoice — {invoice.invoiceNo}</h4>
            <p className="text-muted mb-0 small">Update guests, advance & discount</p>
          </div>
          <button
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: 4 }}>
          <Row className="justify-content-center">
            <Col xxl={12}>
              <Card className="border-0" style={{ borderRadius: 24, boxShadow: '0 10px 35px rgba(0,0,0,0.05)' }}>
                <CardBody className="p-4 p-lg-5">
                  <div className="mb-4 p-3 rounded-3" style={{ background: '#fff7ed' }}>
                    <Row>
                      <Col md={4}>
                        <div className="text-muted small">Customer</div>
                        <div className="fw-semibold">{booking?.enquiry?.customerName}</div>
                      </Col>
                      <Col md={4}>
                        <div className="text-muted small">Booking No.</div>
                        <div className="fw-semibold">{booking?.bookingNo}</div>
                      </Col>
                      <Col md={4}>
                        <div className="text-muted small">Function</div>
                        <div className="fw-semibold">{booking?.functionType?.functionName}</div>
                      </Col>
                    </Row>
                  </div>

                  <InvoiceAmountDetails
                    booking={booking}
                    guests={guests}
                    onGuestsChange={setGuests}
                    advance={advance}
                    onAdvanceChange={setAdvance}
                    discount={discount}
                    onDiscountChange={setDiscount}
                    onCalculatedChange={setCalculated}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        <div className="border-top bg-white" style={{ padding: 10, flexShrink: 0 }}>
          <div className="d-flex gap-3">
            <button className="btn btn-light w-100 py-2" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              onClick={handleSubmit}
              disabled={saving}>
              <IconifyIcon icon="solar:diskette-broken" />
              {saving ? 'Updating...' : 'Update Invoice'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditInvoiceDrawer

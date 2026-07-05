'use client'

import React, { useEffect, useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Alert, Card, CardBody, Col, Row } from 'react-bootstrap'
import CustomFlatpickr from '@/components/CustomFlatpickr'

const AddInvoiceDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    invoiceDate: '',
    dueDate: '',
    status: 'Active',
  })

  /* BODY SCROLL LOCK */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  const handleSubmit = () => {}

  return (
    <>
      {/* OPEN BUTTON */}
      <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Invoice
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 1040,
          }}
        />
      )}

      {/* DRAWER */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '1200px',
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
        {/* HEADER */}
        <div
          className="d-flex align-items-center justify-content-between border-bottom"
          style={{
            padding: '18px 24px',
            background: '#fff',
            flexShrink: 0,
          }}>
          <div>
            <h4 className="fw-bold mb-1">Create Invoice</h4>
            <p className="text-muted mb-0 small">Manage invoice details & payment information</p>
          </div>

          <button
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 4,
          }}>
          <Row className="justify-content-center">
            <Col xxl={12}>
              <Card
                className="border-0"
                style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 10px 35px rgba(0,0,0,0.05)',
                }}>
                <CardBody className="p-4 p-lg-5">
                  <form>
                    {/* TOP SECTION */}
                    <Row className="g-4 mb-4">
                      <Col lg={6}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Booking No.</label>

                          <input type="text" className="form-control form-control-lg" />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Total Amount</label>

                          <input type="number" className="form-control form-control-lg" disabled />
                        </div>

                        <div>
                          <label className="form-label fw-semibold">Payment Method</label>

                          <input type="text" className="form-control form-control-lg" disabled />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Invoice Number</label>

                          <input type="text" className="form-control form-control-lg" />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Issue Date</label>

                          <CustomFlatpickr
                            className="form-control"
                            placeholder="Select Date"
                            options={{ enableTime: false }}
                            value={form.dueDate}
                            onChange={(_, dateStr) => setForm({ ...form, dueDate: dateStr })}
                          />
                        </div>

                        <div>
                          <label className="form-label fw-semibold">Due Date</label>

                          <CustomFlatpickr
                            className="form-control"
                            placeholder="Select Date"
                            options={{ enableTime: false }}
                            value={form.dueDate}
                            onChange={(_, dateStr) => setForm({ ...form, dueDate: dateStr })}
                          />
                        </div>
                      </Col>
                    </Row>

                    {/* PARTY DETAILS */}
                    <Row className="g-4 mb-4">
                      <Col lg={6}>
                        <div
                          className="h-100"
                          style={{
                            background: '#fff7ed',
                            borderRadius: 20,
                            padding: 24,
                          }}>
                          <h5 className="fw-bold mb-4">Sender Information</h5>

                          <div className="mb-3">
                            <label className="form-label">Name</label>

                            <input type="text" className="form-control" />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Phone</label>

                            <input type="text" className="form-control" />
                          </div>

                          <div>
                            <label className="form-label">Email</label>

                            <input type="email" className="form-control" />
                          </div>
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div
                          className="h-100"
                          style={{
                            background: '#eff6ff',
                            borderRadius: 20,
                            padding: 24,
                          }}>
                          <h5 className="fw-bold mb-4">Receiver Information</h5>

                          <div className="mb-3">
                            <label className="form-label">Name</label>

                            <input type="text" className="form-control" disabled />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Phone</label>

                            <input type="text" className="form-control" disabled />
                          </div>

                          <div>
                            <label className="form-label">Email</label>

                            <input type="email" className="form-control" disabled />
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* TABLE */}
                    <div
                      className="table-responsive mb-4"
                      style={{
                        borderRadius: 18,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                      }}>
                      <table className="table align-middle mb-0">
                        <thead
                          style={{
                            background: '#f1f5f9',
                          }}>
                          <tr>
                            <th>Total Amount</th>
                            <th>Additional Amount</th>
                            <th>Subtotal Amount</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr>
                            {[1, 2, 3].map((_, i) => (
                              <td key={i}>
                                <input type="number" className="form-control" disabled />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* TOTALS */}
                    <Row className="justify-content-end">
                      <Col lg={5} xl={4}>
                        <div
                          style={{
                            background: '#fff',
                            borderRadius: 22,
                            padding: 24,
                            border: '1px solid #e2e8f0',
                          }}>
                          {['Advance', ' Tax', 'SGST (5%)', 'CGST (5%)', 'Discount'].map((label, i) => (
                            <div className="mb-3" key={i}>
                              <label className="form-label fw-semibold">{label}</label>

                              <div className="input-group">
                                <span className="input-group-text bg-light">
                                  <IconifyIcon icon="bx:rupee" />
                                </span>

                                <input type="number" className="form-control" disabled />
                              </div>
                            </div>
                          ))}

                          <div className="border-top pt-3 mt-4">
                            <label className="form-label fw-bold fs-5">Grand Total</label>

                            <div className="input-group">
                              <span className="input-group-text bg-success text-white">
                                <IconifyIcon icon="bx:rupee" />
                              </span>

                              <input type="text" className="form-control fw-bold" disabled />
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* ALERT */}
                    <Alert className="mt-4 border-0 bg-danger-subtle text-danger">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center bg-danger text-white rounded-circle"
                          style={{
                            width: 42,
                            height: 42,
                          }}>
                          <IconifyIcon icon="bx:info-circle" />
                        </div>

                        <div>All accounts are to be paid within 7 days from receipt of invoice.</div>
                      </div>
                    </Alert>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        {/* FOOTER */}
        <div
          className="border-top bg-white"
          style={{
            padding: 10,
            flexShrink: 0,
          }}>
          <div className="d-flex gap-3">
            <button className="btn btn-light w-100 py-2" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" onClick={handleSubmit}>
              <IconifyIcon icon="solar:diskette-broken" />
              Save Invoice
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddInvoiceDrawer

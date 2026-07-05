/* eslint-disable @next/next/no-img-element */
'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import React, { useRef } from 'react'
import { Badge, Button, Card, CardBody, Col, Row, Table } from 'react-bootstrap'
import { useGetBookingByIdQuery } from '@/store/bookingApi'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import logoDark from '@/assets/images/logo.png'
import { useGetTermsQuery } from '@/store/termsApi'

interface Props {
  bookingId?: string
}

const InvoicesDetails = ({ bookingId }: Props) => {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const { data: booking, isLoading } = useGetBookingByIdQuery(bookingId!, { skip: !bookingId })
  const { data: termsData } = useGetTermsQuery()

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  const findSafeSliceY = (canvas: any, maxY: any) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return maxY
    const scanRange = Math.min(150, maxY) // look back up to 150px for a blank row
    for (let y = maxY; y > maxY - scanRange; y--) {
      const row = ctx.getImageData(0, y, canvas.width, 1).data
      let isBlank = true
      for (let i = 0; i < row.length; i += 4) {
        if (row[i] < 250 || row[i + 1] < 250 || row[i + 2] < 250) {
          isBlank = false
          break
        }
      }
      if (isBlank) return y
    }
    return maxY
  }
  const downloadPDF = async () => {
    const element = invoiceRef.current
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')

    const pdfWidth = 210
    const pdfHeight = 297

    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const margin = 10 // mm padding on all sides
    const usableWidth = pdfWidth - margin * 2
    const usableHeight = pdfHeight - margin * 2

    // how much of the canvas (in px) fits in one page's usable height
    const pageCanvasHeight = (usableHeight * canvas.width) / usableWidth

    let renderedHeight = 0
    while (renderedHeight < canvas.height) {
      let sliceHeight = Math.min(pageCanvasHeight, canvas.height - renderedHeight)
      if (renderedHeight + sliceHeight < canvas.height) {
        const safeY = findSafeSliceY(canvas, renderedHeight + sliceHeight)
        sliceHeight = safeY - renderedHeight
      }

      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sliceHeight
      const ctx = pageCanvas.getContext('2d')
      if (!ctx) continue
      ctx.drawImage(canvas, 0, renderedHeight, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)

      const sliceImgData = pageCanvas.toDataURL('image/png')
      const sliceImgHeight = (sliceHeight * usableWidth) / canvas.width

      if (renderedHeight > 0) pdf.addPage()
      pdf.addImage(sliceImgData, 'PNG', margin, margin, usableWidth, sliceImgHeight)

      renderedHeight += sliceHeight
    }

    pdf.save(`invoice-${invoice.invoiceNo}.pdf`)
  }

  const invoice = {
    invoiceNo: booking?.bookingNo || '--',
    bookingDate: booking?.bookingDate
      ? new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '--',
    issueDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    dueDate: '--',
    functionName: booking?.functionType?.functionName || '--',
    functionDate: booking?.bookingDate
      ? new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '--',
    status: booking?.status || '--',
    customer: {
      name: booking?.enquiry?.customerName || '--',
      mobile: booking?.enquiry?.mobileNo || '--',
      email: booking?.enquiry?.email || '--',
    },
    company: {
      name: 'Shree Ganesh Caterers',
      phone: '+91 9988776655',
      email: 'support@shreeganesh.com',
      address: 'MG Road, Pune',
      gst: '27ABCDE1234F1Z5',
    },
    items: [
      { id: 1, item: 'Buffet Charges', qty: 1, price: booking?.totalAmount || 0 },
      { id: 2, item: 'Additional Charges', qty: 1, price: booking?.additionalAmount || 0 },
      { id: 3, item: 'Starters + Chat Menu Charges', qty: 1, price: booking?.specialMenuAmount || 0 },
    ],
  }

  const subTotal = booking?.subtotalamount || 0

  const gst = booking?.gst || 0
  const discount = booking?.discount || 0
  const grandTotal = booking?.grandTotal || 0
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success' // green

      case 'Pencil':
        return 'secondary' // gray

      case 'Cancelled':
        return 'danger' // red

      default:
        return 'secondary'
    }
  }

  return (
    <>
      <style jsx global>{`
        body {
          background: #eef2f7;
          font-family: Inter, sans-serif;
        }

        .invoice-page {
          width: 210mm;
          min-height: 297mm;
          background: #fff;
          margin: auto;
        }

        .invoice-card {
          border: 0;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        }

        .table-modern thead th {
          background: #111827 !important;
          color: white !important;
          border: none !important;
          padding: 10px !important;
          font-size: 13px;
        }

        .table-modern td {
          padding: 10px !important;
          border-color: #edf2f7 !important;
          vertical-align: middle;
          font-size: 14px;
        }

        .summary-table td {
          border: 0 !important;
          padding: 4px 0 !important;
        }

        .soft-bg {
          background: #f8fafc;
        }
      `}</style>

      <Row className="justify-content-center py-3">
        <Col xl={12}>
          {/* ========================= */}
          {/* BUTTON */}
          {/* ========================= */}

          <div className="text-end mb-3">
            <Button variant="dark" className="rounded-pill px-4" onClick={downloadPDF}>
              <IconifyIcon icon="solar:download-bold" className="me-2" />
              Download PDF
            </Button>
          </div>

          {/* ========================= */}
          {/* INVOICE */}
          {/* ========================= */}

          <div ref={invoiceRef} className="invoice-page p-0">
            <Card className="invoice-card">
              <CardBody className="p-4">
                {/* HEADER */}

                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <img
                      src={logoDark.src}
                      alt="Company Logo"
                      width={180}
                      height={55}
                      crossOrigin="anonymous"
                      style={{
                        display: 'block',
                        objectFit: 'contain',
                        maxWidth: '180px',
                        height: '55px',
                      }}
                    />

                    <h4 className="fw-bold mt-2 mb-1">{invoice.company.name}</h4>

                    <p className="small text-muted mb-1">{invoice.company.address}</p>

                    <p className="small text-muted mb-1">{invoice.company.phone}</p>

                    <p className="small text-muted mb-0">GSTIN : {invoice.company.gst}</p>
                  </div>

                  <div className="text-end">
                    <h1
                      className="fw-bolder mb-2"
                      style={{
                        fontSize: '40px',
                      }}>
                      QUOTATION
                    </h1>

                    <Badge bg={getStatusBadge(invoice.status)} className="rounded-pill px-3 py-2 mb-2">
                      {invoice.status}
                    </Badge>

                    <div className="small">
                      <div>#{invoice.invoiceNo}</div>

                      <div>{invoice.issueDate}</div>
                    </div>
                  </div>
                </div>

                {/* CUSTOMER */}

                <div className="soft-bg rounded-4 p-3 mb-4">
                  <Row>
                    <Col md={6}>
                      <p className="text-muted small mb-1">Bill To</p>

                      <h6 className="fw-bold mb-1">{invoice.customer.name}</h6>

                      <p className="small mb-1">{invoice.customer.mobile}</p>

                      <p className="small mb-0">{invoice.customer.email}</p>
                    </Col>

                    <Col md={6} className="text-md-end">
                      <p className="text-muted small mb-1">Event Details</p>

                      <h6 className="fw-bold mb-1">{invoice.functionName}</h6>

                      <p className="small mb-1">Function : {invoice.functionDate}</p>

                      <p className="small mb-0">Booking : {invoice.bookingDate}</p>
                    </Col>
                  </Row>
                </div>

                {/* TABLE */}

                <Table className="table-modern mb-4">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Service</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>

                        <td className="fw-semibold">{item.item}</td>

                        <td className="text-center">{item.qty}</td>

                        <td className="text-end">₹{item.price.toLocaleString()}</td>

                        <td className="text-end fw-bold">₹{(item.qty * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* TOTAL */}

                <Row className="align-items-end">
                  <Col md={7}>
                    <div className="border rounded-4 p-3 h-100">
                      <h6 className="fw-bold mb-2">Note</h6>

                      <p className="small text-muted mb-0">भोजनाची पाने कमी झाल्यास अन्न बांधून दिले जाणार नाही व पैसे कमी होणार नाहीत.</p>
                    </div>
                  </Col>

                  <Col md={5}>
                    <div className="soft-bg rounded-4 p-3">
                      <table className="table summary-table mb-0">
                        <tbody>
                          <tr>
                            <td>Subtotal</td>

                            <td className="text-end fw-semibold">₹{subTotal.toLocaleString()}</td>
                          </tr>

                          <tr>
                            <td>GST</td>

                            <td className="text-end fw-semibold">₹{gst.toLocaleString()}</td>
                          </tr>

                          <tr>
                            <td>Discount</td>

                            <td className="text-end text-danger fw-semibold">- ₹{discount.toLocaleString()}</td>
                          </tr>

                          <tr>
                            <td colSpan={2}>
                              <hr className="my-2" />
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-bold fs-5">Total</td>

                            <td className="text-end fw-bold fs-4 text-success">₹{grandTotal.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>

                {/* FOOTER */}

                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <div>
                    <p className="small text-muted mb-1">Thank you for your business</p>

                    <h6 className="fw-bold mb-0">{invoice.company.name}</h6>
                  </div>

                  <div className="text-end">
                    <p className="small text-muted mb-4">Authorized Signature</p>

                    <h6 className="fw-bold mb-0">Shree Ganesh</h6>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-bold mb-3">📋 नियम व अटी</h6>

                  <ol className="ps-3 mb-0">
                    {termsData?.map((item: any, index: number) => (
                      <li key={item._id || index} className="small text-muted mb-3">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.content,
                          }}
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default InvoicesDetails

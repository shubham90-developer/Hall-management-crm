/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useRef } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useGetBookingByIdQuery } from '@/store/bookingApi'
import logoDark from '@/assets/images/logo.png'

interface Props {
  bookingId?: string
}

const minutesToTime = (minutes?: number | string): string => {
  if (minutes === undefined || minutes === null || minutes === '') return '--'
  const m = Number(minutes)
  if (Number.isNaN(m)) return '--'
  const h = Math.floor(m / 60)
  const min = m % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${min.toString().padStart(2, '0')} ${period}`
}

const statusBadge = (status?: string) => {
  switch (status) {
    case 'Confirmed':
      return { bg: '#dcfce7', color: '#15803d' }
    case 'Pencil':
      return { bg: '#f1f5f9', color: '#475569' }
    case 'Cancelled':
      return { bg: '#fee2e2', color: '#b91c1c' }
    case 'NB':
      return { bg: '#dbeafe', color: '#1d4ed8' }
    default:
      return { bg: '#f1f5f9', color: '#475569' }
  }
}

const MenuPrint = ({ bookingId }: Props) => {
  const { data: booking, isLoading } = useGetBookingByIdQuery(bookingId!, { skip: !bookingId })
  const printRef = useRef<HTMLDivElement>(null)

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

  const findSafeSliceY = (canvas: HTMLCanvasElement, maxY: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return maxY
    const scanRange = Math.min(150, maxY)
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
    const element = printRef.current
    if (!element) return

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    const pdfWidth = 210
    const margin = 10
    const usableWidth = pdfWidth - margin * 2
    const usableHeight = 297 - margin * 2
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

    pdf.save(`menu-slip-${booking.bookingNo || booking._id}.pdf`)
  }

  // ---- everything below reads straight off the booking, nothing guessed/hardcoded ----
  const b: any = booking

  const guests = b.guests?.toString() || '--'
  const rate = b.guests && b.subtotalamount ? Math.round(b.subtotalamount / b.guests).toString() : '--'
  const mealTime = b.mealTime || minutesToTime(b.startTime)
  const functionDay = b.functionDate
    ? new Date(b.functionDate).toLocaleDateString('en-IN', { weekday: 'long' })
    : b.bookingDate
      ? new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'long' })
      : '--'
  const bookingDateStr = b.bookingDate
    ? new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '--'

  const menuItems: any[] = b.menu || []
  const sweets: any[] = b.sweets || []
  const additional: any[] = b.additional || []
  const starters: any[] = b.starters || []
  const chatMenu: any[] = b.chatMenu || []
  // "other" is populated as { id: { itemName, price }, startTime, endTime } — this is your real
  // चहा / कॉफी / नाश्ता / डेकोरेशन / तयारी / भटजी / न्हावी data, whichever the booking actually has
  const otherItems: any[] = b.other || []

  const badge = statusBadge(b.status)

  const Section = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
    <div className="menu-section">
      <div className="menu-section-header">
        {icon} {title}
      </div>
      {children}
    </div>
  )

  const renderItemTable = (icon: string, title: string, items: any[], withPrice = true) =>
    items.length > 0 && (
      <Section icon={icon} title={title}>
        <table className="table-modern">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>#</th>
              <th>पदार्थ</th>
              {withPrice && <th style={{ width: '20%' }}>दर</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item._id || i}>
                <td>{i + 1}</td>
                <td className="fw-semibold">{item.itemName || '--'}</td>
                {withPrice && <td>{item.price ? `₹${item.price}` : '--'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    )

  return (
    <>
      <style jsx global>{`
        .menu-page {
          width: 210mm;
          min-height: 297mm;
          background: #fff;
          margin: auto;
          color: #1f2937;
          font-family: Inter, sans-serif;
        }

        .menu-card {
          border: 0;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        }

        .menu-section {
          border: 1px solid #edf2f7;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .menu-section-header {
          background: #f8fafc;
          padding: 8px 14px;
          font-weight: 700;
          font-size: 14px;
          border-bottom: 1px solid #edf2f7;
        }

        .table-modern {
          width: 100%;
          border-collapse: collapse;
        }

        .table-modern thead th {
          background: #111827 !important;
          color: white !important;
          border: none !important;
          padding: 8px 10px !important;
          font-size: 12px;
          text-align: left;
        }

        .table-modern td {
          padding: 8px 10px !important;
          border-bottom: 1px solid #edf2f7 !important;
          vertical-align: middle;
          font-size: 13px;
        }

        .soft-bg {
          background: #f8fafc;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .info-cell {
          background: #f8fafc;
          border: 1px solid #edf2f7;
          border-radius: 10px;
          padding: 8px 12px;
        }

        .info-cell .info-label {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 2px;
        }

        .info-cell .info-value {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }
      `}</style>

      <Row className="justify-content-center py-3">
        <Col xl={12}>
          <div className="text-end mb-3">
            <Button variant="dark" className="rounded-pill px-4" onClick={downloadPDF}>
              <IconifyIcon icon="solar:download-bold" className="me-2" />
              Download PDF
            </Button>
          </div>

          <div ref={printRef} className="menu-page p-0">
            <div className="menu-card p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={logoDark.src}
                    alt="Company Logo"
                    width={150}
                    height={46}
                    crossOrigin="anonymous"
                    style={{ display: 'block', objectFit: 'contain', maxWidth: '150px', height: '46px' }}
                  />
                  <div>
                    <p className="small text-muted mb-0" style={{ fontSize: '13px' }}>
                      || श्री ||
                    </p>
                    <h5 className="fw-bold mb-0">Shree Ganesh Caterers</h5>
                  </div>
                </div>

                <div className="text-end">
                  <h2 className="fw-bolder mb-1" style={{ fontSize: '26px' }}>
                    MENU SLIP
                  </h2>
                  <span
                    className="rounded-pill px-3 py-1 fw-semibold d-inline-block"
                    style={{ background: badge.bg, color: badge.color, fontSize: '13px' }}>
                    {b.status || '--'}
                  </span>
                  <div className="small text-muted mt-1">#{b.bookingNo || b._id}</div>
                </div>
              </div>

              {/* Booking info */}
              <div className="info-grid mb-3">
                <div className="info-cell">
                  <div className="info-label">नाव</div>
                  <div className="info-value">{b.enquiry?.customerName || '--'}</div>
                </div>
                <div className="info-cell">
                  <div className="info-label">तारीख</div>
                  <div className="info-value">{bookingDateStr}</div>
                </div>
                <div className="info-cell">
                  <div className="info-label">वार</div>
                  <div className="info-value">{functionDay}</div>
                </div>

                <div className="info-cell">
                  <div className="info-label">हॉल</div>
                  <div className="info-value">{b.hall?.hallName || '--'}</div>
                </div>
                <div className="info-cell">
                  <div className="info-label">कार्यक्रम</div>
                  <div className="info-value">{b.functionType?.functionName || '--'}</div>
                </div>
                <div className="info-cell">
                  <div className="info-label">वेळ</div>
                  <div className="info-value">{b.enquiry?.timeSlot || '--'}</div>
                </div>

                <div className="info-cell">
                  <div className="info-label">मुहूर्त</div>
                  <div className="info-value">{b.Muhurat || '--'}</div>
                </div>
                <div className="info-cell">
                  <div className="info-label">भोजन : मंडळी</div>
                  <div className="info-value">{guests}</div>
                </div>
                <div className="info-cell">
                  <div className="info-label">दर</div>
                  <div className="info-value">₹{rate}</div>
                </div>

                <div className="info-cell">
                  <div className="info-label">व्यवस्था</div>
                  <div className="info-value">
                    {b.menuType || '--'} {b.seatingArrangement ? `(${b.seatingArrangement})` : ''}
                  </div>
                </div>
                <div className="info-cell">
                  <div className="info-label">भोजनाची वेळ</div>
                  <div className="info-value">{mealTime}</div>
                </div>
              </div>

              {/* Menu items */}
              <Section icon="🍽️" title="मुख्य मेनू / Menu">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th style={{ width: '8%' }}>#</th>

                      <th>पदार्थ</th>
                      <th>टीप</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.length === 0 ? (
                      <tr>
                        <td className="text-center text-muted" colSpan={4}>
                          No menu items added yet
                        </td>
                      </tr>
                    ) : (
                      menuItems.map((m, i) => (
                        <tr key={m._id || i}>
                          <td>{i + 1}</td>
                          <td className="fw-semibold">{m.menuId?.itemName || '--'}</td>
                          <td>{m.note || ''}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Section>

              {b.menu_note && (
                <div className="soft-bg rounded-4 p-3 mb-3">
                  <div className="text-muted small mb-1">📝 मेनू टीप / Menu Note</div>
                  <div className="fw-semibold">{b.menu_note}</div>
                </div>
              )}

              {renderItemTable('🍰', 'मिठाई / Sweets', sweets)}
              {renderItemTable('🥗', 'स्टार्टर / Starters', starters)}
              {renderItemTable('🍜', 'चाट मेनू / Chat Menu', chatMenu)}
              {renderItemTable('➕', 'अतिरिक्त / Additional Items', additional)}

              {/* Other services actually selected on this booking */}
              {otherItems.length > 0 && (
                <Section icon="🧾" title="सेवा / Other Services">
                  <table className="table-modern">
                    <thead>
                      <tr>
                        <th style={{ width: '8%' }}>#</th>
                        <th>सेवा</th>
                        <th style={{ width: '20%' }}>दर</th>
                        <th style={{ width: '25%' }}>वेळ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherItems.map((o, i) => (
                        <tr key={o.id?._id || i}>
                          <td>{i + 1}</td>
                          <td className="fw-semibold">{o.id?.itemName || '--'}</td>
                          <td>{o.id?.price ? `₹${o.id.price}` : '--'}</td>
                          <td>{o.startTime || o.endTime ? `${o.startTime || '--'} - ${o.endTime || '--'}` : '--'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Section>
              )}

              {/* Payment summary + notice */}
              <Row className="g-3 mt-1">
                <Col md={6}>
                  <div className="soft-bg rounded-4 p-3 h-100">
                    <h6 className="fw-bold mb-2">💰 Payment Summary</h6>
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <td className="py-1">ऍडव्हान्स</td>
                          <td className="py-1 text-end fw-semibold">
                            ₹{b.advance?.toLocaleString() || 0} ({b.paymentMethod || '--'})
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1">एकूण रक्कम</td>
                          <td className="py-1 text-end fw-semibold">₹{b.finalAmount?.toLocaleString() || 0}</td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <hr className="my-1" />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 fw-bold">उर्वरित रक्कम</td>
                          <td className="py-1 text-end fw-bold text-danger">₹{b.pendingAmount?.toLocaleString() || 0}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border rounded-4 p-3 h-100 text-center d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-2">सूचना</h6>
                      <p className="small text-muted mb-0">** भोजनाची पाने कमी झाल्यास अन्न बांधून दिले जाणार नाही व पैसे कमी होणार नाहीत **</p>
                    </div>
                    <div className="border-top mt-4 pt-2">सही</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default MenuPrint

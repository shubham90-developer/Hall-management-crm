'use client'

import React, { useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useGetBookingByIdQuery } from '@/store/bookingApi'
import { useParams } from 'next/navigation'

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

// "50kg" -> 50, "1 kg" -> 1, "" -> 0
const parseQtyNumber = (val: string) => {
  const match = String(val ?? '').match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

// "50kg" -> "kg", "1 kg" -> "kg"
const parseUnit = (val: string) => {
  const match = String(val ?? '').match(/[a-zA-Z]+/)
  return match ? match[0] : ''
}

const GrosaryPrint = () => {
  const { id } = useParams() as { id: string }
  const { data: booking, isLoading } = useGetBookingByIdQuery(id, { skip: !id })

  const pdfRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
    return <p>loading data plzz wait</p>
  }

  // Booking's actual guest count — the basis for every calculated quantity
  const guests = Number(booking?.guests) || 0

  const groceryMap: Record<string, { name: string; qty: number; unit: string }> = {}

  ;(booking?.menu as any[])?.forEach((menuItem: any) => {
    // baseQty = the guest count this menu item's grocery quantities were originally set for
    const baseQty = Number(menuItem.qty) || 0

    const groceryList = Array.isArray(menuItem.grosaryName) ? menuItem.grosaryName : []

    groceryList.forEach((entry: any) => {
      // entry = { item: { _id, grosaryName, ... }, qty: '50kg' } (after populate fix)
      const gId = entry.item?._id
      const gName = entry.item?.grosaryName || '--'
      const entryQty = parseQtyNumber(entry.qty)
      const unit = parseUnit(entry.qty)

      if (!gId) return

      // rate per guest for this item, based on how it was set up in Add Menu
      const rate = baseQty > 0 ? entryQty / baseQty : 0
      const required = Number((rate * guests).toFixed(2))

      if (groceryMap[gId]) {
        groceryMap[gId].qty += required
      } else {
        groceryMap[gId] = { name: gName, qty: required, unit }
      }
    })
  })

  const GrosaryItems = Object.values(groceryMap).map((item) => ({
    name: item.name,
    qty: Number(item.qty.toFixed(2)),
    unit: item.unit,
  }))

  const bookingDetails = {
    date: booking?.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '--',
    startTime: booking?.startTime ? minutesToTime(Number(booking.startTime)) : '--',
    endTime: booking?.endTime ? minutesToTime(Number(booking.endTime)) : '--',
    event: booking?.functionType?.functionName || '--',
    hall: booking?.hall?.hallName || '--',
    guests: booking?.guests?.toString() || '--',
    mealArrangement: booking?.seatingArrangement || '--',
  }

  const downloadPDF = async () => {
    if (!pdfRef.current) return

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const pageHeight = 297
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0.1) {
      // ← change 0 to 0.1
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save('grocery-requirement-sheet.pdf')
  }

  return (
    <div style={{ background: '#f5f7fb', minHeight: '100vh', padding: '30px' }}>
      <div className="text-end mb-3">
        <Link href="/bookings" className="btn btn-light mx-2">
          <IconifyIcon icon="solar:arrow-left-bold" className="me-2" />
          Back
        </Link>
        <Button variant="danger" onClick={downloadPDF}>
          <IconifyIcon icon="solar:download-bold" className="me-2" />
          Download PDF
        </Button>
      </div>

      <div
        ref={pdfRef}
        style={{
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          background: '#fff',
          padding: '12mm',
          boxShadow: '0 0 25px rgba(0,0,0,0.12)',
          borderRadius: '12px',
          color: '#000',
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <div>
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, fontWeight: 700 }}>🛒 GROSARY REQUIREMENT SHEET</h2>
            <p style={{ marginTop: '6px', color: '#666', fontSize: '13px' }}>Event Grosary & Quantity Summary</p>
          </div>

          {/* Booking Details */}
          <div style={{ border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '10px', fontWeight: 700, borderBottom: '1px solid #ddd' }}>📋 Booking Details</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={cellLabel}>📅 Date</td>
                  <td style={cellValue}>{bookingDetails.date}</td>
                  <td style={cellLabel}>⏰ Start Time</td>
                  <td style={cellValue}>{bookingDetails.startTime}</td>
                </tr>
                <tr>
                  <td style={cellLabel}>🎉 Event</td>
                  <td style={cellValue}>{bookingDetails.event}</td>
                  <td style={cellLabel}>🏛 Hall</td>
                  <td style={cellValue}>{bookingDetails.hall}</td>
                </tr>
                <tr>
                  <td style={cellLabel}>👥 Guests</td>
                  <td style={cellValue}></td>
                  <td style={cellLabel}>🍽 Meal</td>
                  <td style={cellValue}>{bookingDetails.mealArrangement}</td>
                </tr>
                <tr>
                  <td style={cellLabel}>⏰ End Time</td>
                  <td style={cellValue}>{bookingDetails.endTime}</td>
                  <td style={cellLabel}>📋 Status</td>
                  <td style={cellValue}>{booking?.status || '--'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Items */}
          <div style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
            <div
              style={{
                background: '#f8fafc',
                padding: '10px',
                fontWeight: 700,
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <span>🛒 Grocery Items</span>
              <span>Total Items : {GrosaryItems.length}</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Item Name</th>
                  <th style={thStyle}>Required Qty (for {guests} guests)</th>
                </tr>
              </thead>
              <tbody>
                {GrosaryItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#999' }}>
                      No grocery items found
                    </td>
                  </tr>
                ) : (
                  GrosaryItems.map((item, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>
                        {item.qty} {item.unit}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer — always at bottom */}
        <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '180px' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '8px', textAlign: 'center' }}>Prepared By</div>
          </div>
          <div style={{ width: '180px' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '8px', textAlign: 'center' }}>Manager Signature</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const cellLabel: React.CSSProperties = { padding: '10px', fontWeight: 600, border: '1px solid #eee', width: '15%', background: '#fafafa' }
const cellValue: React.CSSProperties = { padding: '10px', border: '1px solid #eee' }
const thStyle: React.CSSProperties = { padding: '10px', border: '1px solid #ddd', textAlign: 'left', fontSize: '13px' }
const tdStyle: React.CSSProperties = { padding: '8px 10px', border: '1px solid #eee', fontSize: '13px' }

export default GrosaryPrint

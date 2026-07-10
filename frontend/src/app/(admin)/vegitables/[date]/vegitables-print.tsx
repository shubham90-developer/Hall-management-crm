'use client'

import React, { useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useGetDayRequirementsQuery } from '@/store/bookingApi'

const VegetablesByDatePrint = () => {
  const { date } = useParams() as { date: string }
  const searchParams = useSearchParams()
  const autoDownload = searchParams.get('autodownload') === 'true'
  const { data, isLoading } = useGetDayRequirementsQuery(date, { skip: !date })

  const pdfRef = useRef<HTMLDivElement>(null)

  const vegetableItems = data?.vegetables || []

  const downloadPDF = async () => {
    if (!pdfRef.current) return

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pdfWidth = 210
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('vegetables-requirement-sheet.pdf')
  }

  useEffect(() => {
    if (autoDownload && data && !isLoading) {
      downloadPDF()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDownload, data, isLoading])

  if (isLoading) {
    return <p>loading data plzz wait</p>
  }

  return (
    <div style={{ background: '#f5f7fb', minHeight: '100vh', padding: '30px' }}>
      <div className="text-end mb-3">
        <Link href="/vegitables" className="btn btn-light mx-2">
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
          <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, fontWeight: 700 }}>🥬 VEGETABLES REQUIREMENT SHEET</h2>
            <p style={{ marginTop: '6px', color: '#666', fontSize: '13px' }}>Combined Requirement — All Bookings on this Date</p>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '10px', fontWeight: 700, borderBottom: '1px solid #ddd' }}>📋 Date Summary</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={cellLabel}>📅 Function Date</td>
                  <td style={cellValue}>
                    {data?.functionDate
                      ? new Date(data.functionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                      : '--'}
                  </td>
                  <td style={cellLabel}>📦 Bookings Combined</td>
                  <td style={cellValue}>{data?.bookingsCount ?? 0}</td>
                </tr>
              </tbody>
            </table>
          </div>

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
              <span>🥦 Vegetable Items</span>
              <span>Total Items : {vegetableItems.length}</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Item Name</th>
                  <th style={thStyle}>Total Required Qty</th>
                </tr>
              </thead>
              <tbody>
                {vegetableItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#999' }}>
                      No vegetable items found for this date
                    </td>
                  </tr>
                ) : (
                  vegetableItems.map((item, index) => (
                    <tr key={item.name}>
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

export default VegetablesByDatePrint

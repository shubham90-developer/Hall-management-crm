'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'

const crockeryItems = [
  {
    name: 'Dish',
    icon: '🍽️',
  },
  {
    name: 'Bowls',
    icon: '🥣',
  },
  {
    name: 'Serving Spoon',
    icon: '🥄',
  },
  {
    name: 'Rice Bucket',
    icon: '🍚',
  },
  {
    name: 'Tong Spoon',
    icon: '🍴',
  },
  {
    name: 'Handle Pot',
    icon: '🫕',
  },
  {
    name: 'Bowl',
    icon: '🥣',
  },
  {
    name: 'Plate Bowl',
    icon: '🍜',
  },
  {
    name: 'Tongs',
    icon: '🗜️',
  },
  {
    name: 'Jug',
    icon: '🍶',
  },
  {
    name: 'Cup',
    icon: '☕',
  },
  {
    name: 'Small Plates',
    icon: '🍽️',
  },
  {
    name: 'Steel Bowls',
    icon: '🥣',
  },
  {
    name: 'Steel Plates',
    icon: '🍛',
  },
  {
    name: 'Glass',
    icon: '🥛',
  },
  {
    name: 'Buffet Lamps',
    icon: '💡',
  },
  {
    name: 'Spoons',
    icon: '🥄',
  },
]

const AddCrokeryList = () => {
  const [showDrawer, setShowDrawer] = useState(false)

  const [quantities, setQuantities] = useState<Record<string, string>>({})

  const handleQtyChange = (item: string, value: string) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: value,
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      {/* Open Button */}
      <button
        className="btn btn-success text-center rounded-pill px-4 d-flex align-items-center justify-content-center gap-2"
        onClick={() => setShowDrawer(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Crockery
      </button>

      {/* Overlay */}
      {showDrawer && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(15,23,42,0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 1040,
          }}
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '860px',
          maxWidth: '100%',
          zIndex: 1050,
          transition: '0.35s ease',
          transform: showDrawer ? 'translateX(0)' : 'translateX(100%)',
        }}>
        {/* Header */}
        <div
          className="px-4 py-3 text-white"
          id="print-area"
          style={{
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
          }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold mb-1 text-white">🍽️ Crockery Management</h4>

              <p className="mb-0 small opacity-75">Manage crockery quantities</p>
            </div>

            <button className="btn btn-light btn-sm rounded-circle" onClick={() => setShowDrawer(false)}>
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          className="px-4 py-3 overflow-auto"
          style={{
            height: 'calc(100% - 190px)',
          }}>
          {/* Top Info (Border Table - 3 Items Per Row) */}
          <div className="table-responsive mb-4">
            <table className="table table-bordered align-middle mb-0">
              <tbody>
                {[
                  { icon: '📅', label: 'Date', value: '1 June 2026' },
                  { icon: '🕖', label: 'Time', value: '7:00 PM' },
                  { icon: '🌇', label: 'Event', value: 'Evening' },
                  { icon: '🏢', label: 'Hall', value: 'Hall 1' },
                  { icon: '👥', label: 'Guests', value: '500' },
                  { icon: '👥', label: ' Meal Arrangement', value: 'Buffet' },
                ]
                  .reduce((rows: any[], item, index) => {
                    const rowIndex = Math.floor(index / 3)
                    if (!rows[rowIndex]) rows[rowIndex] = []
                    rows[rowIndex].push(item)
                    return rows
                  }, [])
                  .map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((item: any, index: number) => (
                        <td key={index} className="p-3">
                          <div className="d-flex align-items-center gap-2">
                            {/* Icon */}
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle bg-light border"
                              style={{
                                width: 36,
                                height: 36,
                                fontSize: 14,
                                flexShrink: 0,
                              }}>
                              {item.icon}
                            </div>

                            {/* Text */}
                            <div className="lh-sm">
                              <div className="text-muted small">{item.label}</div>
                              <div className="fw-semibold">{item.value}</div>
                            </div>
                          </div>
                        </td>
                      ))}

                      {/* Fill empty columns if not multiple of 3 */}
                      {Array.from({ length: 3 - row.length }).map((_, i) => (
                        <td key={`empty-${i}`}></td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Crockery Items */}
          <div className="d-flex flex-column gap-3">
            {crockeryItems.map((item, index) => (
              <div key={index} className="bg-light rounded-4 p-3 border-0">
                <div className="d-flex align-items-center justify-content-between gap-3">
                  {/* Left */}
                  <div className="d-flex align-items-center gap-3">
                    {/* Icon */}
                    <div
                      className="bg-white rounded-4 d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: 58,
                        height: 58,
                        fontSize: 24,
                      }}>
                      {item.icon}
                    </div>

                    {/* Name */}
                    <div>
                      <h6 className="fw-bold mb-1">{item.name}</h6>

                      <p className="text-muted small mb-0">Crockery Item</p>
                    </div>
                  </div>

                  {/* Qty */}
                  <div style={{ width: '120px' }}>
                    <label className="form-label text-muted small mb-1">Qty</label>

                    <input
                      type="number"
                      className="form-control form-control-lg rounded-3 text-center fw-semibold"
                      placeholder="0"
                      value={quantities[item.name] || ''}
                      onChange={(e) => handleQtyChange(item.name, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-top bg-white p-3">
          <div className="d-flex gap-2">
            <button className="btn btn-light border w-100" onClick={() => setShowDrawer(false)}>
              Cancel
            </button>

            <Link href="/bookings/crockery/1" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
              <IconifyIcon icon="solar:printer-broken" />
              Save & Print
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddCrokeryList

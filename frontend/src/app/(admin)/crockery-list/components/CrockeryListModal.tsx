'use client'

import React, { useState, useEffect } from 'react'
import { Modal, Button, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { useUpdateCrockeryBookingMutation, ICrockeryItem } from '@/store/bookingApi'

interface Props {
  booking: any
  onCancel: () => void
}

const parseQtyNumber = (val: string) => {
  const match = String(val ?? '').match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

const parseUnit = (val: string) => {
  const match = String(val ?? '').match(/[a-zA-Z]+/)
  return match ? match[0] : ''
}

// Content-only component (no own <Modal> wrapper) — see BuffetCountModal.tsx.
const CrockeryListModal = ({ booking, onCancel }: Props) => {
  const [items, setItems] = useState<ICrockeryItem[]>([])
  const [updateCrockeryBooking, { isLoading }] = useUpdateCrockeryBookingMutation()
  const router = useRouter()

  useEffect(() => {
    if (!booking) return

    if (booking.crockeryList?.length) {
      setItems(booking.crockeryList)
      return
    }

    const guests = Number(booking.guests) || 0
    const crockeryMap: Record<string, ICrockeryItem> = {}

    ;(booking.menu as any[])?.forEach((menuItem: any) => {
      const baseQty = Number(menuItem.qty) || 0
      const crockeryList = Array.isArray(menuItem.crocekryName) ? menuItem.crocekryName : []

      crockeryList.forEach((entry: any) => {
        const crocName = entry.item?.crocekryName || '--'
        const entryQty = parseQtyNumber(entry.qty)
        const unit = parseUnit(entry.qty)
        const rate = baseQty > 0 ? entryQty / baseQty : 0
        const required = Number((rate * guests).toFixed(2))

        if (crockeryMap[crocName]) {
          crockeryMap[crocName].currentQty += required
        } else {
          crockeryMap[crocName] = { name: crocName, unit, currentQty: required, additionalQty: 0 }
        }
      })
    })

    setItems(Object.values(crockeryMap))
  }, [booking])

  const handleAdditionalChange = (idx: number, value: string) => {
    setItems((prev) => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], additionalQty: Number(value) || 0 }
      return updated
    })
  }

  const handleNewRowNameChange = (value: string) => {
    setItems((prev) => [...prev, { name: value, unit: '', currentQty: 0, additionalQty: 0 }])
  }

  const handleNameChange = (idx: number, value: string) => {
    setItems((prev) => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], name: value }
      return updated
    })
  }

  const handleSave = async () => {
    try {
      const cleanItems = items.filter((i) => i.name.trim() !== '')
      await updateCrockeryBooking({ id: booking._id, data: { crockeryList: cleanItems } }).unwrap()
      onCancel()
      router.push(`/menu-selction/crockery/${booking._id}`)
    } catch {
      Swal.fire('Error', 'Failed to save crockery list', 'error')
    }
  }

  return (
    <>
      <Modal.Header closeButton onHide={onCancel}>
        <Modal.Title>🍽️ Crockery List</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table bordered responsive size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Current Qty</th>
              <th>Additional Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  {item.currentQty > 0 ? (
                    item.name
                  ) : (
                    <input
                      className="form-control form-control-sm"
                      value={item.name}
                      placeholder="New item name"
                      onChange={(e) => handleNameChange(idx, e.target.value)}
                    />
                  )}
                </td>
                <td>{item.currentQty}</td>
                <td>
                  <input
                    type="number"
                    min={0}
                    className="form-control form-control-sm"
                    value={item.additionalQty}
                    onChange={(e) => handleAdditionalChange(idx, e.target.value)}
                  />
                </td>
                <td className="fw-bold">{item.currentQty + item.additionalQty}</td>
              </tr>
            ))}

            <tr>
              <td>{items.length + 1}</td>
              <td>
                <input
                  className="form-control form-control-sm"
                  placeholder="New item name"
                  value=""
                  onChange={(e) => handleNewRowNameChange(e.target.value)}
                />
              </td>
              <td>0</td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Crockery'}
        </Button>
      </Modal.Footer>
    </>
  )
}

export default CrockeryListModal

'use client'

import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useUpdateCrockeryBookingMutation } from '@/store/bookingApi'

interface Props {
  booking: any
  onCancel: () => void
  onSaved: () => void
}

// Content-only component — no own <Modal> wrapper. Rendered inside the
// shared Modal shell in MenuSelectionDetails.tsx to avoid two overlapping
// Modal/backdrop instances (which was causing the auto-close bug).
const BuffetCountModal = ({ booking, onCancel, onSaved }: Props) => {
  const [noOfBuffets, setNoOfBuffets] = useState<number>(booking?.noOfBuffets || 0)
  const [updateCrockeryBooking, { isLoading }] = useUpdateCrockeryBookingMutation()

  useEffect(() => {
    setNoOfBuffets(booking?.noOfBuffets || 0)
  }, [booking])

  const handleSave = async () => {
    try {
      await updateCrockeryBooking({ id: booking._id, data: { noOfBuffets } }).unwrap()
      onSaved()
    } catch {
      Swal.fire('Error', 'Failed to save number of buffets', 'error')
    }
  }

  return (
    <>
      <Modal.Header closeButton onHide={onCancel}>
        <Modal.Title>🍽️ No. of Buffets</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label className="form-label">Number of Buffets</label>
        <select className="form-select" value={noOfBuffets} onChange={(e) => setNoOfBuffets(Number(e.target.value))}>
          <option value={0} disabled>
            Select number of buffets
          </option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </Modal.Footer>
    </>
  )
}

export default BuffetCountModal

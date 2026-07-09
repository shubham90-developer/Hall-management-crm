'use client'

import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { useUpdatePricingBookingMutation, IBooking } from '@/store/bookingApi'
import Swal from 'sweetalert2'

interface Props {
  show: boolean
  onHide: () => void
  booking: IBooking
}

const CGST_RATE = 0.09
const SGST_RATE = 0.09

const PricingModal = ({ show, onHide, booking }: Props) => {
  const router = useRouter()
  const [hallAmount, setHallAmount] = useState<number>(booking.hallAmount || 0)
  const [updatePricing, { isLoading }] = useUpdatePricingBookingMutation()

  const isNB = booking.status === 'NB'

  useEffect(() => {
    setHallAmount(booking.hallAmount || 0)
  }, [booking, show])

  const cgst = isNB ? 0 : Number((hallAmount * CGST_RATE).toFixed(2))
  const sgst = isNB ? 0 : Number((hallAmount * SGST_RATE).toFixed(2))
  const finalPayable = hallAmount + cgst + sgst

  const handleSave = async () => {
    try {
      await updatePricing({
        id: booking._id,
        data: { hallAmount, cgst, sgst },
      }).unwrap()

      onHide()
      router.push(`/bookings/bookings-details/bill/${booking._id}`)
    } catch (err) {
      Swal.fire('Error', 'Failed to save pricing', 'error')
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <ModalHeader closeButton>
        <ModalTitle>💰 Add Hall Pricing</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <div className="mb-3">
          <label className="form-label">Total Amount (Hall Amount)</label>
          <input type="number" className="form-control" value={hallAmount} onChange={(e) => setHallAmount(Number(e.target.value))} min={0} />
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">CGST (9%)</span>
          <span className="fw-semibold">₹{cgst}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">SGST (9%)</span>
          <span className="fw-semibold">₹{sgst}</span>
        </div>
        {isNB && <p className="text-danger small mb-2">NB booking — CGST/SGST set to 0</p>}

        <hr />
        <div className="d-flex justify-content-between">
          <span className="fw-bold">Final Payable</span>
          <span className="fw-bold text-primary">₹{finalPayable}</span>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="light" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Pricing'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default PricingModal

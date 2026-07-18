'use client'

import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { useUpdatePricingBookingMutation, IBooking } from '@/store/bookingApi'
import { useGetGstQuery } from '@/store/gstApi'
import Swal from 'sweetalert2'

interface Props {
  show: boolean
  onHide: () => void
  booking: IBooking
}

const PricingModal = ({ show, onHide, booking }: Props) => {
  const router = useRouter()
  const [hallAmount, setHallAmount] = useState<number>(booking.hallAmount || 0)
  const [hallAmountMethod, setHallAmountMethod] = useState<string>(booking.hallAmountMethod || 'Cash')
  const [updatePricing, { isLoading }] = useUpdatePricingBookingMutation()
  const { data: gstData } = useGetGstQuery()

  const isNB = booking.status === 'NB'

  useEffect(() => {
    setHallAmount(booking.hallAmount || 0)
    setHallAmountMethod(booking.hallAmountMethod || 'Cash')
  }, [booking, show])

  // Hall GST from the GST master is the combined rate — split equally between CGST and SGST
  const hallGst = gstData?.hallGst || 0
  const cgstRate = hallGst / 2 / 100
  const sgstRate = hallGst / 2 / 100

  const cgst = isNB ? 0 : Number((hallAmount * cgstRate).toFixed(2))
  const sgst = isNB ? 0 : Number((hallAmount * sgstRate).toFixed(2))
  const totalGst = Number((cgst + sgst).toFixed(2))
  const finalPayable = hallAmount + cgst + sgst

  const handleSave = async () => {
    try {
      await updatePricing({
        id: booking._id,
        data: { hallAmount, cgst, sgst, hallAmountMethod },
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

        <div className="mb-3">
          <label className="form-label">💳 Payment Method</label>
          <select className="form-select" value={hallAmountMethod} onChange={(e) => setHallAmountMethod(e.target.value)}>
            <option value="--" disabled>
              Select Payment Method
            </option>
            <option value="Cash">💵 Cash</option>
            <option value="UPI">📱 UPI</option>
            <option value="PhonePe">📲 PhonePe</option>
            <option value="Google Pay">💳 Google Pay</option>
            <option value="Paytm">💰 Paytm</option>
            <option value="Bank Transfer">🏦 Bank Transfer</option>
            <option value="Cheque">🧾 Cheque</option>
            <option value="Card">💳 Debit / Credit Card</option>
            <option value="Net Banking">🌐 Net Banking</option>
            <option value="Pending">⏳ Pending</option>
          </select>
        </div>

        {!isNB && (
          <>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">CGST ({(hallGst / 2).toFixed(2)}%)</span>
              <span className="fw-semibold">₹{cgst}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">SGST ({(hallGst / 2).toFixed(2)}%)</span>
              <span className="fw-semibold">₹{sgst}</span>
            </div>
          </>
        )}
        {isNB && <p className="text-danger small mb-2">NB booking — CGST/SGST not applicable</p>}

        {!isNB && (
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted fw-semibold">Total GST</span>
            <span className="fw-semibold">₹{totalGst}</span>
          </div>
        )}

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

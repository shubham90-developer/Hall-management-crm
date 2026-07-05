'use client'

import React, { useEffect, useMemo } from 'react'
import { useGetGstQuery } from '@/store/gstApi'
import { IBooking } from '@/store/bookingApi'

interface Props {
  booking: IBooking | null | undefined
  guests: number
  onGuestsChange: (val: number) => void
  advance: number
  onAdvanceChange: (val: number) => void
  discount: number
  onDiscountChange: (val: number) => void
  onCalculatedChange: (values: {
    totalAmount: number
    additionalAmount: number
    subtotalamount: number
    gst: number
    grandTotal: number
    finalAmount: number
    pendingAmount: number
  }) => void
}

// same list used in the booking/quotation pricing tab — these items are charged per-guest,
// everything else in "other" is a flat charge regardless of guest count
const PER_GUEST_ITEMS = ['स्टार्टर्स', 'नाश्ता', 'कॉफी', 'चहा', 'Parcel']

const priced = (arr: any[] = []) => (arr || []).filter((i) => typeof i === 'object' && i !== null)

const InvoiceAmountDetails = ({
  booking,
  guests,
  onGuestsChange,
  advance,
  onAdvanceChange,
  discount,
  onDiscountChange,
  onCalculatedChange,
}: Props) => {
  const { data: gstData } = useGetGstQuery()

  // ── same formula as quotation: guests × selected sweet/additional menu price ──
  const totalAmount = useMemo(() => {
    const sweetTotal = priced(booking?.sweets as any[]).reduce((sum, s) => sum + Number(s.price || 0), 0)
    const additionalTotal = priced(booking?.additional as any[]).reduce((sum, a) => sum + Number(a.price || 0), 0)
    return guests * (sweetTotal + additionalTotal)
  }, [guests, booking])

  // ── "other" items: only PER_GUEST_ITEMS are multiplied by guests, rest are flat ──
  const additionalAmount = useMemo(() => {
    const otherArr = (booking?.other || []).map((o: any) => o.id).filter((i: any) => typeof i === 'object' && i !== null)
    return otherArr.reduce(
      (sum: number, i: any) => sum + (PER_GUEST_ITEMS.includes(i.itemName) ? Number(i.price || 0) * guests : Number(i.price || 0)),
      0,
    )
  }, [guests, booking])

  // ── starters + chat menu: same formula as quotation's specialMenuAmount ──
  const specialMenuAmount = useMemo(() => {
    const startersTotal = priced(booking?.starters as any[]).reduce((sum, s) => sum + Number(s.price || 0), 0)
    const chatMenuTotal = priced(booking?.chatMenu as any[]).reduce((sum, c) => sum + Number(c.price || 0), 0)
    return guests * (startersTotal + chatMenuTotal)
  }, [guests, booking])

  const combinedTotalAmount = useMemo(() => totalAmount + specialMenuAmount, [totalAmount, specialMenuAmount])
  const subtotalamount = useMemo(() => combinedTotalAmount + additionalAmount, [combinedTotalAmount, additionalAmount])
  const gstAmount = useMemo(() => (subtotalamount * (gstData?.gst || 0)) / 100, [subtotalamount, gstData])
  const grandTotal = useMemo(() => subtotalamount + gstAmount, [subtotalamount, gstAmount])
  const finalAmount = useMemo(() => grandTotal - discount, [grandTotal, discount])
  const pendingAmount = useMemo(() => finalAmount - advance, [finalAmount, advance])

  useEffect(() => {
    // NOTE: the invoice DB schema only stores totalAmount / additionalAmount (no separate
    // specialMenuAmount field), so we fold specialMenuAmount into additionalAmount here.
    // subtotalamount/grandTotal/etc sent up are already correct (computed with all 3 buckets).
    onCalculatedChange({
      totalAmount: combinedTotalAmount,
      additionalAmount,
      subtotalamount,
      gst: gstAmount,
      grandTotal,
      finalAmount,
      pendingAmount,
    })
  }, [totalAmount, additionalAmount, specialMenuAmount, subtotalamount, gstAmount, grandTotal, finalAmount, pendingAmount])

  return (
    <div>
      {/* ── the ONE input driving every calculation below ── */}
      <div className="mb-4">
        <label className="form-label fw-semibold fs-5">No. of Guests</label>
        <input
          type="number"
          className="form-control form-control-lg"
          placeholder="Enter number of guests"
          value={guests === 0 ? '' : guests}
          onChange={(e) => onGuestsChange(Number(e.target.value))}
        />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Advance</label>
          <input
            type="number"
            className="form-control form-control-lg"
            value={advance === 0 ? '' : advance}
            onChange={(e) => onAdvanceChange(Number(e.target.value))}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Discount</label>
          <input
            type="number"
            className="form-control form-control-lg"
            value={discount === 0 ? '' : discount}
            onChange={(e) => onDiscountChange(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="table-responsive mb-4" style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table className="table align-middle mb-0">
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th>Total Amount</th>
              <th>Additional Amount</th>

              <th>Subtotal</th>
              <th>GST ({gstData?.gst || 0}%)</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>₹{totalAmount}</td>
              <td>₹{additionalAmount}</td>

              <td>₹{subtotalamount}</td>
              <td>₹{gstAmount.toFixed(2)}</td>
              <td className="fw-bold">₹{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="row justify-content-end">
        <div className="col-lg-5">
          <div style={{ background: '#fff', borderRadius: 22, padding: 24, border: '1px solid #e2e8f0' }}>
            <div className="d-flex justify-content-between mb-2">
              <span>Final Amount</span>
              <span className="fw-semibold">₹{finalAmount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Advance Paid</span>
              <span className="fw-semibold">₹{advance}</span>
            </div>
            <div className="border-top pt-3 mt-2 d-flex justify-content-between">
              <span className="fw-bold fs-5">Pending Amount</span>
              <span className="fw-bold fs-5 text-danger">₹{pendingAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceAmountDetails

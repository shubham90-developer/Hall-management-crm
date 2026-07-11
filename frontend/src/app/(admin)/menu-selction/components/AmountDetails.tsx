import React, { useMemo, useEffect, useState } from 'react'
import { useGetGstQuery } from '@/store/gstApi'
import { IMenuList } from '@/store/menuListApi'
import { ISweetMenu } from '@/store/sweetMenuApi'
import { IOtherMenu } from '@/store/otherMenuApi'
import { IOtherList } from '@/store/otherListApi'
import { IStartersMenu } from '@/store/startersMenuApi'
import { IChatMenu } from '@/store/chatMenuApi'
import { SEATING_PRICES } from './Othermenu'
interface PricingForm {
  discount: number
}

interface Props {
  pricingForm: PricingForm
  onPricingChange: (key: string, val: number) => void
  advance: number
  onAdvanceChange: (val: number) => void
  guests: number
  sweetMenuList: ISweetMenu[]
  selectedSweets: string[]
  otherMenuList: IOtherMenu[]
  selectedAdditional: string[]
  otherList: IOtherList[]
  selectedOther: { id: string; startTime: string; endTime: string }[]
  startersMenuList?: IStartersMenu[]
  selectedStarters?: string[]
  chatMenuList?: IChatMenu[]
  selectedChatMenu?: string[]
  seatingArrangement: string
  onCalculatedChange: (values: {
    totalAmount: number
    additionalAmount: number
    specialMenuAmount: number
    gst: number
    grandTotal: number
    finalAmount: number
    pendingAmount: number
  }) => void
}

const AmountDetails = ({
  pricingForm,
  onPricingChange,
  advance,
  onAdvanceChange,
  guests,
  sweetMenuList,
  selectedSweets,
  otherMenuList,
  selectedAdditional,
  otherList,
  selectedOther,
  startersMenuList = [],
  selectedStarters = [],
  chatMenuList = [],
  selectedChatMenu = [],
  seatingArrangement,
  onCalculatedChange,
}: Props) => {
  const { data: gstData } = useGetGstQuery()
  const PER_GUEST_ITEMS = ['स्टार्टर्स', 'नाश्ता', 'कॉफी', 'चहा', 'Parcel']
  const totalAmount = useMemo(() => {
    const sweetTotal = sweetMenuList.filter((s) => selectedSweets.includes(s._id)).reduce((sum, s) => sum + Number(s.price), 0)
    const additionalTotal = otherMenuList.filter((a) => selectedAdditional.includes(a._id)).reduce((sum, a) => sum + Number(a.price), 0)
    return guests * (sweetTotal + additionalTotal)
  }, [guests, sweetMenuList, selectedSweets, otherMenuList, selectedAdditional])

  const additionalAmount = useMemo(() => {
    const otherTotal = otherList
      .filter((o) => selectedOther.some((s) => s.id === o._id))
      .reduce((sum, o) => sum + (PER_GUEST_ITEMS.includes(o.itemName) ? Number(o.price) * guests : Number(o.price)), 0)
    return otherTotal
  }, [guests, otherList, selectedOther])

  const specialMenuAmount = useMemo(() => {
    const startersTotal = startersMenuList.filter((s) => selectedStarters.includes(s._id)).reduce((sum, s) => sum + Number(s.price), 0)
    const chatMenuTotal = chatMenuList.filter((c) => selectedChatMenu.includes(c._id)).reduce((sum, c) => sum + Number(c.price), 0)
    return guests * (startersTotal + chatMenuTotal)
  }, [guests, startersMenuList, selectedStarters, chatMenuList, selectedChatMenu])
  const seatingAmount = useMemo(() => guests * (SEATING_PRICES[seatingArrangement] || 0), [guests, seatingArrangement])
  // merge starters+chat into total amount — no longer shown as a separate field
  const combinedTotalAmount = useMemo(() => totalAmount + specialMenuAmount + seatingAmount, [totalAmount, specialMenuAmount, seatingAmount])

  const subtotalamount = useMemo(() => combinedTotalAmount + additionalAmount, [combinedTotalAmount, additionalAmount])
  const gstAmount = useMemo(() => (subtotalamount * (gstData?.gst || 0)) / 100, [subtotalamount, gstData])

  const grandTotal = useMemo(() => subtotalamount + gstAmount, [subtotalamount, gstAmount])

  const finalAmount = useMemo(() => grandTotal - pricingForm.discount, [grandTotal, pricingForm.discount])

  const pendingAmount = useMemo(() => finalAmount - advance, [finalAmount, advance])

  // Local display string for Discount — decoupled from the numeric value so:
  // - it shows blank by default when discount is 0
  // - typing "0" doesn't get wiped back to blank (it only tracks the numeric value, not display text)
  const [discountInput, setDiscountInput] = useState(pricingForm.discount === 0 ? '' : String(pricingForm.discount))

  // Keep display text in sync only when discount changes from OUTSIDE this input
  // (e.g. a different booking is loaded) — not when it changes because of our own typing,
  // otherwise typing "0" would immediately get reset back to blank.
  useEffect(() => {
    const currentInputAsNumber = discountInput === '' ? 0 : Number(discountInput)
    if (currentInputAsNumber !== pricingForm.discount) {
      setDiscountInput(pricingForm.discount === 0 ? '' : String(pricingForm.discount))
    }
  }, [pricingForm.discount])

  useEffect(() => {
    onCalculatedChange({
      totalAmount: combinedTotalAmount,
      additionalAmount,
      specialMenuAmount: 0, // kept as key for backward compatibility, always 0 going forward
      gst: gstAmount,
      grandTotal,
      finalAmount,
      pendingAmount,
    })
  }, [combinedTotalAmount, additionalAmount, gstAmount, grandTotal, finalAmount, pendingAmount])

  return (
    <div className="p-3 overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Total Amount</label>
          <input type="number" className="form-control" value={combinedTotalAmount === 0 ? '' : combinedTotalAmount} disabled />
        </div>

        <div className="col-md-3">
          <label className="form-label">Additional Amount</label>
          <input type="number" className="form-control" value={additionalAmount === 0 ? '' : additionalAmount} disabled />
        </div>

        <div className="col-md-3">
          <label className="form-label">Subtotal Amount</label>
          <input type="number" className="form-control" value={subtotalamount === 0 ? '' : subtotalamount} disabled />
        </div>

        <div className="col-md-3">
          <label className="form-label">GST ({gstData?.gst || 0}%)</label>
          <input type="number" className="form-control" value={gstAmount === 0 ? '' : gstAmount} disabled />
        </div>

        <div className="col-md-3">
          <label className="form-label">Grand Total</label>
          <input type="number" className="form-control" value={grandTotal === 0 ? '' : grandTotal} disabled />
        </div>

        <div className="col-md-3">
          <label className="form-label">Discount</label>
          <input
            type="number"
            className="form-control"
            value={discountInput}
            onChange={(e) => {
              const val = e.target.value
              setDiscountInput(val)
              onPricingChange('discount', val === '' ? 0 : Number(val))
            }}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Final Amount</label>
          <input type="number" className="form-control" value={finalAmount === 0 ? '' : finalAmount} disabled />
        </div>

        <div className="col-md-3">
          <label className="form-label">💵 Advance</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter advance amount"
            value={advance === 0 ? '' : advance}
            onChange={(e) => onAdvanceChange(Number(e.target.value))}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Pending Amount</label>
          <input type="number" className="form-control" value={pendingAmount} disabled />
        </div>
      </div>
    </div>
  )
}

export default AmountDetails

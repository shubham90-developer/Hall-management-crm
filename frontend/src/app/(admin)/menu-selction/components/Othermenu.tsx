import CustomFlatpickr from '@/components/CustomFlatpickr'
import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { IOtherList } from '@/store/otherListApi'

export const SEATING_PRICES: Record<string, number> = {
  Standard: 15,
  Premium: 30,
  Pangat: 50,
}
interface Props {
  otherList: IOtherList[]
  selectedOther: { id: string; startTime: string; endTime: string }[]
  onOtherChange: (items: { id: string; startTime: string; endTime: string }[]) => void
  seatingArrangement: string
  onSeatingChange: (val: string) => void
}

const OtherMenu = ({ otherList, selectedOther, onOtherChange, seatingArrangement, onSeatingChange }: Props) => {
  const isSelected = (id: string) => selectedOther.some((o) => o.id === id)

  const toggleItem = (id: string) => {
    if (!id) return
    if (isSelected(id)) {
      onOtherChange(selectedOther.filter((o) => o.id !== id))
    } else {
      onOtherChange([...selectedOther, { id, startTime: '', endTime: '' }])
    }
  }

  const handleTimeChange = (id: string, field: 'startTime' | 'endTime', val: string) => {
    onOtherChange(selectedOther.map((o) => (o.id === id ? { ...o, [field]: val } : o)))
  }

  const getTime = (id: string, field: 'startTime' | 'endTime') => selectedOther.find((o) => o.id === id)?.[field] || ''

  return (
    <Card>
      <CardHeader as="h4" className="text-dark">
        Add Other Menu Items
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered table-bordered">
            <thead className="bg-light-subtle">
              <tr>
                <td>Select</td>
                <td>Menu Name</td>
                <td>Price</td>
                <td>Start Time</td>
                <td>End Time</td>
              </tr>
            </thead>
            <tbody>
              {otherList.map((item) => {
                console.log('otherList item:', item) // ← add this
                return (
                  <tr key={item._id}>
                    <td>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={isSelected(item._id)} onChange={() => toggleItem(item._id)} />
                      </div>
                    </td>
                    <td className="fw-bold text-dark">{item.itemName}</td>
                    <td>₹{item.price}/-</td>
                    <td>
                      <CustomFlatpickr
                        className="form-control"
                        placeholder="Select Time"
                        value={getTime(item._id, 'startTime')}
                        onChange={(_, dateStr) => handleTimeChange(item._id, 'startTime', dateStr)}
                        options={{ enableTime: true, noCalendar: true, dateFormat: 'h:i K', time_24hr: false, minTime: '09:00' }}
                      />
                    </td>
                    <td>
                      <CustomFlatpickr
                        className="form-control"
                        placeholder="Select Time"
                        value={getTime(item._id, 'endTime')}
                        onChange={(_, dateStr) => handleTimeChange(item._id, 'endTime', dateStr)}
                        options={{ enableTime: true, noCalendar: true, dateFormat: 'h:i K', time_24hr: false, minTime: '09:00' }}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardBody>
      <div className="mt-3 ">
        <label className="form-label">🍽️ Seating Arrangement for Meal</label>
        <select className="form-select" value={seatingArrangement} onChange={(e) => onSeatingChange(e.target.value)}>
          <option value="">Select Dining Type</option>

          <option value="Standard">🥗 स्टँडर्ड बुफे - ₹15/प्लेट</option>
          <option value="Premium">🍛 प्रीमियम बुफे - ₹30/प्लेट</option>
          <option value="Pangat">🍛 पंगत - ₹50/प्लेट</option>
        </select>
      </div>
    </Card>
  )
}

export default OtherMenu

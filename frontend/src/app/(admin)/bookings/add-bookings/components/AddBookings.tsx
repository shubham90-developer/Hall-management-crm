'use client'

import CustomFlatpickr from '@/components/CustomFlatpickr'
import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import Select, { components } from 'react-select'
import RegularMenu from './RegularMenu'
import SpecialMenu from './SpecialMenu'
import ManageService from './ManageService'
import OtherMenu from './Othermenu'
import AmountDetails from './AmountDetails'

const AddBookings = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    bookingDate: '',
    functionDay: '',
    functionTime: '',
    endDate: '',
    muhurat: '',
    refUrl: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(formData)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader as={'h4'} className="text-dark">
            Basic Details
          </CardHeader>
          <CardBody>
            <div className="p-3 overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
              <div className="row g-3">
                {/* Booking no */}
                <div className="col-md-3">
                  <label className="form-label">Booking No.</label>
                  <input type="text" className="form-control" placeholder="" />
                </div>
                {/* customer name */}
                <div className="col-md-3">
                  <label className="form-label">Customer Name</label>
                  <input type="text" className="form-control" placeholder="" />
                </div>

                {/* mobile Number */}
                <div className="col-md-3">
                  <label className="form-label">Mobile Number</label>
                  <input type="text" className="form-control" placeholder="" />
                </div>

                {/* Email Address */}
                <div className="col-md-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" placeholder="" />
                </div>

                {/* GST No */}
                <div className="col-md-3">
                  <label className="form-label">GST No.</label>
                  <input type="email" className="form-control" placeholder="" />
                </div>

                {/* booking Date */}
                <div className="col-md-3">
                  <label className="form-label">Booking Date</label>

                  <CustomFlatpickr
                    className="form-control"
                    placeholder="Select Date"
                    value={formData.bookingDate}
                    onChange={(selectedDates, dateStr) =>
                      setFormData((prev) => ({
                        ...prev,
                        bookingDate: dateStr,
                      }))
                    }
                    options={{
                      enableTime: false,
                      dateFormat: 'Y-m-d',
                    }}
                  />
                </div>

                {/* Function Name */}
                <div className="col-md-3">
                  <label className="form-label">Function Name</label>
                  <input type="text" className="form-control" placeholder="" />
                </div>

                {/* Muhurat */}
                <div className="col-md-3">
                  <label className="form-label">Muhurat</label>
                  <CustomFlatpickr
                    className="form-control"
                    placeholder="Select Muhurat Time"
                    value={formData.muhurat}
                    onChange={(selectedDates, dateStr) =>
                      setFormData((prev) => ({
                        ...prev,
                        muhurat: dateStr,
                      }))
                    }
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K', // 10:30 AM
                      time_24hr: false,
                      minTime: '09:00',
                    }}
                  />
                </div>

                {/* Meal: Guests */}
                <div className="col-md-3">
                  <label className="form-label">Meal: Guests</label>
                  <input type="text" className="form-control" placeholder="" />
                </div>

                {/* Meal: Type */}
                {/* <div className="col-md-3">
                  <label className="form-label">Seating Arrangement for Meal</label>
                  <select className="form-select">
                    <option value="">🍽️ Select Dining Type</option>
                    <option value="Buffet">🥗 Buffet</option>
                    <option value="Pangat">🍛 Pangat</option>
                  </select>
                </div> */}

                <div className="col-md-3">
                  <label className="form-label">Meal Time</label>
                  <input type="time" className="form-control" />
                </div>

                {/* Selected Hall */}
                <div className="col-md-3">
                  <label className="form-label">Select Hall</label>
                  <select className="form-select">
                    <option value="">🏢 Select Hall</option>
                    <option value="hall1">🏛️ Hall 1</option>
                    <option value="hall2">🏛️ Hall 2</option>
                    <option value="fullhall">🎉 Full Hall</option>
                  </select>
                </div>

                {/* Function Day & Date*/}
                <div className="col-md-3">
                  <label className="form-label">Function Day & Date</label>

                  <CustomFlatpickr
                    className="form-control"
                    placeholder="Select Date"
                    value={formData.functionDay}
                    onChange={(selectedDates, dateStr) =>
                      setFormData((prev) => ({
                        ...prev,
                        functionDay: dateStr,
                      }))
                    }
                    options={{
                      enableTime: false,
                      dateFormat: 'Y-m-d',
                    }}
                  />
                </div>

                {/* Selecte Event Time */}
                <div className="col-md-3">
                  <label className="form-label">Select Event Time</label>
                  <select className="form-select">
                    <option value="">🕒 Select Time</option>
                    <option value="morning">🌅 Morning</option>
                    <option value="afternoon">☀️ Afternoon</option>
                    <option value="evening">🌙 Evening</option>
                  </select>
                </div>

                {/* Function Time */}
                <div className="col-md-3">
                  <label className="form-label">Function Time</label>
                  <CustomFlatpickr
                    className="form-control"
                    placeholder="Select Function Time"
                    value={formData.functionTime}
                    onChange={(selectedDates, dateStr) =>
                      setFormData((prev) => ({
                        ...prev,
                        muhurat: dateStr,
                      }))
                    }
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K', // 10:30 AM
                      time_24hr: false,
                      minTime: '09:00',
                    }}
                  />
                </div>

                {/* type */}
                <div className="col-md-3">
                  <label className="form-label">Booking Type</label>
                  <select className="form-select">
                    <option value="">📋 Select Status</option>
                    <option value="Confirmed">✅ Confirmed</option>
                    <option value="Cancelled">❌ Cancelled</option>
                    <option value="Pencil">✏️ Pencil</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div className="col-md-3">
                  <label className="form-label ">Payment Method</label>

                  <select name="paymentMethod" className="form-select " defaultValue="">
                    <option value="" disabled>
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
              </div>
            </div>
          </CardBody>
        </Card>

        {/* regular menu */}
        <RegularMenu />

        {/* special menu */}
        <SpecialMenu />

        {/* ManageService */}
        <ManageService />

        {/* other menu */}
        <OtherMenu />

        {/* amount details */}
        <AmountDetails />
      </form>
    </>
  )
}

export default AddBookings

'use client'

import CustomFlatpickr from '@/components/CustomFlatpickr'
import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import Select, { components } from 'react-select'

const BasicInfo = () => {
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
              </div>
            </div>
          </CardBody>
        </Card>
      </form>
    </>
  )
}

export default BasicInfo

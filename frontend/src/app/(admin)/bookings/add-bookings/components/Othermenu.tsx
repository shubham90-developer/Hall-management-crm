import CustomFlatpickr from '@/components/CustomFlatpickr'
import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'

const OtherMenu = () => {
  const [formData, setFormData] = useState({
    time: '',
  })
  return (
    <>
      <Card>
        <CardHeader as={'h4'} className="text-dark">
          Add Other Menu Items
        </CardHeader>
        <CardBody>
          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered table-bordered">
              <thead className="bg-light-subtle">
                <tr>
                  <td>Menu Name</td>
                  <td>Qty</td>
                  <td>Price</td>
                  <td>Time</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold text-dark">Tea</td>
                  <td>
                    <input type="text" className="form-control" placeholder="" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="" disabled />
                  </td>
                  <td>
                    <CustomFlatpickr
                      className="form-control"
                      placeholder="Select  Time"
                      value={formData.time}
                      onChange={(selectedDates, dateStr) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: dateStr,
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
                  </td>
                </tr>

                <tr>
                  <td className="fw-bold text-dark">Coffee</td>
                  <td>
                    <input type="text" className="form-control" placeholder="" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="" disabled />
                  </td>
                  <td>
                    <CustomFlatpickr
                      className="form-control"
                      placeholder="Select  Time"
                      value={formData.time}
                      onChange={(selectedDates, dateStr) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: dateStr,
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
                  </td>
                </tr>

                <tr>
                  <td className="fw-bold text-dark">Breakfast</td>
                  <td>
                    <input type="text" className="form-control" placeholder="" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="" disabled />
                  </td>
                  <td>
                    <CustomFlatpickr
                      className="form-control"
                      placeholder="Select  Time"
                      value={formData.time}
                      onChange={(selectedDates, dateStr) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: dateStr,
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
                  </td>
                </tr>

                <tr>
                  <td className="fw-bold text-dark">Starters</td>
                  <td>
                    <input type="text" className="form-control" placeholder="" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="" disabled />
                  </td>
                  <td>
                    <CustomFlatpickr
                      className="form-control"
                      placeholder="Select  Time"
                      value={formData.time}
                      onChange={(selectedDates, dateStr) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: dateStr,
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
                  </td>
                </tr>

                <tr>
                  <td className="fw-bold text-dark">Rukhvat/Martubhojan</td>
                  <td>
                    <input type="text" className="form-control" placeholder="" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="" disabled />
                  </td>
                  <td>
                    <CustomFlatpickr
                      className="form-control"
                      placeholder="Select  Time"
                      value={formData.time}
                      onChange={(selectedDates, dateStr) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: dateStr,
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
                  </td>
                </tr>

                <tr>
                  <td className="fw-bold text-dark">Phedhe</td>
                  <td>
                    <input type="text" className="form-control" placeholder="" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="" disabled />
                  </td>
                  <td>
                    <CustomFlatpickr
                      className="form-control"
                      placeholder="Select  Time"
                      value={formData.time}
                      onChange={(selectedDates, dateStr) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: dateStr,
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
                  </td>
                </tr>

                <tr>
                  <td className="fw-bold text-dark">Decoration</td>
                  <td>
                    <input type="text" className="form-control" placeholder="" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="" disabled />
                  </td>
                  <td>
                    <CustomFlatpickr
                      className="form-control"
                      placeholder="Select  Time"
                      value={formData.time}
                      onChange={(selectedDates, dateStr) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: dateStr,
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
                  </td>
                </tr>

                <tr>
                  <td className="fw-bold text-dark">Bhataji</td>
                  <td>
                    <input type="text" className="form-control" placeholder="" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="" disabled />
                  </td>
                  <td>
                    <CustomFlatpickr
                      className="form-control"
                      placeholder="Select  Time"
                      value={formData.time}
                      onChange={(selectedDates, dateStr) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: dateStr,
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
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-dark">Saloon</td>
                  <td>
                    <input type="text" className="form-control" placeholder="" />
                  </td>
                  <td>
                    <input type="text" className="form-control" placeholder="" disabled />
                  </td>
                  <td>
                    <CustomFlatpickr
                      className="form-control"
                      placeholder="Select  Time"
                      value={formData.time}
                      onChange={(selectedDates, dateStr) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: dateStr,
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default OtherMenu

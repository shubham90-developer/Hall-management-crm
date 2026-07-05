'use client'

import CustomFlatpickr from '@/components/CustomFlatpickr'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Col, Form, Row, Tab, Tabs } from 'react-bootstrap'
import SpecialMenu from './SpecialMenu'
import AmountDetails from './AmountDetails'
import OtherMenu from './Othermenu'
import BasicInfo from './BasicInfo'

const data = [
  {
    id: 1,
    BookingNo: '#B-001',
    CustomerName: '	Suraj Jamdade',
    MobileNumber: ' +91 9090909090',
    AlternateNumber: ' +91 9090909090',
    EmailAddress: 'suraj@gmail.com',
    Address: 'pune',
    GSTNo: '	GSTIN0098hyt567',
    BookingDate: '28 May 2026',
    FunctionName: 'Engagement',
    SelectedHall: '	Hall 1 AC',
    FunctionDayDate: '	1 June 2026 | Sunday',
    FunctionTimeFrom: '	7:00 pm',
    FunctionTimeTo: '	8:00 pm',
    BookingType: '	Confirmed',
  },
]

const booking = {
  bookingNo: '#B-001',
  customerName: 'Suraj Jamdade',
  mobile: '+91 9090909090',
  alternateMobile: '+91 9090909090',
  email: 'suraj@gmail.com',
  address: 'Pune, Maharashtra',
  gstNo: 'GSTIN0098HYT567',
  bookingDate: '28 May 2026',
  functionName: 'Engagement',
  hall: 'Hall 1 AC',
  functionDate: '1 June 2026 | Sunday',
  functionTimeFrom: '7:00 PM',
  functionTimeTO: '8:00 PM',
  bookingType: 'Confirmed',
  paymentStatus: 'Paid',
}

const details = [
  { icon: '🆔', label: 'Booking Number', value: booking.bookingNo },
  { icon: '👤', label: 'Customer Name', value: booking.customerName },
  { icon: '📞', label: 'Mobile Number', value: booking.mobile },
  { icon: '📱', label: 'Alternate Mobile', value: booking.alternateMobile },
  { icon: '📧', label: 'Email Address', value: booking.email },
  { icon: '🏠', label: 'Address', value: booking.address },
  { icon: '🧾', label: 'GST Number', value: booking.gstNo },
  { icon: '📅', label: 'Booking Date', value: booking.bookingDate },
  { icon: '🎉', label: 'Function Name', value: booking.functionName },
  { icon: '🏢', label: 'Selected Hall', value: booking.hall },
  { icon: '📆', label: 'Function Date', value: booking.functionDate },
  {
    icon: '🕖',
    label: 'Function Time',
    value: `${booking.functionTimeFrom} - ${booking.functionTimeTO}`,
  },
]

const MenuSelection = () => {
  const [search, setSearch] = useState('')
  const [selectedMenu, setSelectedMenu] = useState('Regular Menu')
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
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">🍽️ Menu Selection</h3>
        <p className="text-muted mb-0">Search and manage menu items</p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs defaultActiveKey="search" id="menu-tabs" className="mb-4">
            {/* Search Tab */}
            <Tab eventKey="search" title=" ➕ Add Menu">
              <div className="mb-3">
                <Form.Control type="text" placeholder="Search Mobile No..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              <Row className="g-4 mb-3">
                {/* Left Side */}
                <Col lg={12}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                      <h5 className="mb-0">👤 Customer Details</h5>

                      <span className="badge bg-success-subtle text-success px-3 py-2">✅ {booking.bookingType}</span>
                    </div>

                    <div className="card-body">
                      <Row className="g-3">
                        {details.map((item, index) => (
                          <Col xl={2} md={6} xs={12} key={index}>
                            <div className="border rounded-3 p-3 h-100 bg-light-subtle">
                              <div className="text-muted small mb-2">
                                {item.icon} {item.label}
                              </div>

                              <h6 className="fw-bold mb-0 text-dark text-break" title={item.value}>
                                {item.value || '--'}
                              </h6>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
              <BasicInfo />
              <Row className="g-4 mb-3">
                {/* Left Side */}
                <Col lg={12}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                      <h5 className="mb-0">🍽️ Select Menu Category</h5>
                    </div>

                    <div className="row g-3 mt-1 mx-2">
                      {[
                        { id: 'regularMenu', label: '🍛 Regular Menu', value: 'Regular Menu' },
                        { id: 'specialMenu', label: '🍜 Special Menu', value: 'Special Menu' },
                        { id: 'deluxMenu', label: '👑 Delux Menu', value: 'Delux Menu' },
                        { id: 'customizeMenu', label: '🛠️ Customize Menu', value: 'Customize Menu' },
                      ].map((menu) => (
                        <div className="col-md-3 col-sm-6" key={menu.id}>
                          <div
                            role="button"
                            onClick={() => setSelectedMenu(menu.value)}
                            className={`border rounded-3 p-3 h-100 cursor-pointer transition-all ${
                              selectedMenu === menu.value ? 'bg-primary-subtle border-primary shadow-sm' : 'bg-white'
                            }`}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="menuType"
                                id={menu.id}
                                value={menu.value}
                                checked={selectedMenu === menu.value}
                                onChange={() => setSelectedMenu(menu.value)}
                              />

                              <label
                                className={`form-check-label fw-semibold ${selectedMenu === menu.value ? 'text-primary' : ''}`}
                                htmlFor={menu.id}>
                                {menu.label}
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Tab>

            {/* Selected Items Tab */}
            <Tab eventKey="selected" title="📋 All Selected Menu List">
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered table-bordered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th style={{ width: 20 }}>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="customCheck1" />
                          <label className="form-check-label" htmlFor="customCheck1" />
                        </div>
                      </th>
                      <th className="text-nowrap">Booking.No.</th>
                      <th className="text-nowrap">Customer Name</th>
                      <th className="text-nowrap">Mobile Number</th>
                      <th className="text-nowrap"> Alternate Number</th>
                      <th className="text-nowrap">Email Address</th>
                      <th className="text-nowrap">Address</th>
                      <th className="text-nowrap">GST Number</th>
                      <th className="text-nowrap">Booking Date</th>
                      <th className="text-nowrap">Function Name</th>
                      <th className="text-nowrap">Selected Hall</th>
                      <th className="text-nowrap">Function Day & Date</th>
                      <th className="text-nowrap">Function Time From</th>
                      <th className="text-nowrap">Function Time To</th>
                      <th className="text-nowrap">Booking Type</th>
                      <th className="text-nowrap">Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id={`booking-${item.id}`} />
                            <label className="form-check-label" htmlFor={`booking-${item.id}`}>
                              &nbsp;
                            </label>
                          </div>
                        </td>

                        <td className="text-nowrap">{item.BookingNo}</td>

                        <td className="text-nowrap">👤 {item.CustomerName}</td>

                        <td className="text-nowrap">
                          <Link href={`tel:${item.MobileNumber}`} className="text-primary">
                            📞 {item.MobileNumber}
                          </Link>
                        </td>

                        <td className="text-nowrap">
                          <Link href={`tel:${item.AlternateNumber}`} className="text-primary">
                            📞 {item.AlternateNumber}
                          </Link>
                        </td>

                        <td className="text-nowrap">📧 {item.EmailAddress}</td>
                        <td className="text-nowrap">🏡 {item.Address}</td>
                        <td className="text-nowrap">🆔 {item.GSTNo}</td>

                        <td className="text-nowrap">📅 {item.BookingDate}</td>

                        <td className="text-nowrap bg-info-subtle text-dark fw-bold">🎉 {item.FunctionName}</td>

                        <td className="text-nowrap bg-warning-subtle text-dark fw-bold">🏢 {item.SelectedHall}</td>

                        <td className="text-nowrap bg-success-subtle text-dark fw-bold">📆 {item.FunctionDayDate}</td>

                        <td className="text-nowrap">🕖 {item.FunctionTimeFrom}</td>
                        <td className="text-nowrap">🕖 {item.FunctionTimeTo}</td>

                        <td className="text-nowrap">
                          <span className="badge bg-success-subtle text-success">✅ {item.BookingType}</span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <Link href={`/menu-selction/details/${item.id}`} className="btn btn-soft-primary btn-sm">
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </Link>

                            {/* <Link href={`/bookings/edit-bookings/${item.id}`} className="btn btn-soft-primary btn-sm">
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                            </Link> */}

                            <Link href="" className="btn btn-soft-danger btn-sm">
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  )
}

export default MenuSelection

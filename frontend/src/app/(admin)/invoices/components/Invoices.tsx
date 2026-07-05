import React from 'react'
import { Card, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import AddInvoiceDrawer from './AddInvoiceDrawer'
import EditInvoiceDrawer from './EditInvoiceDrawer'
import Link from 'next/link'

const data = [
  {
    id: 1,
    InvoiceNo: 'INV-#001',
    BookingNo: 'B-#001',
    CustomerName: 'Suraj jamdade',
    MobileNumber: '+91 9090909090',
    BookingDate: '29 May 2026',
    FunctionName: 'Engagement',
    FunctionDate: '1 June 2026 | Sunday',
    Status: 'Active',
  },
]

const Invoices = () => {
  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4">All Invoices List</CardTitle>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Add Button */}
              <AddInvoiceDrawer />
              {/* Search */}
              <div className="position-relative ms-2 d-none d-md-block">
                <input type="search" className="form-control form-control-sm ps-4" placeholder="Search..." autoComplete="off" />
                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="bg-light-subtle">
                <tr>
                  <th style={{ width: 20 }}>
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="customCheck1" />
                      <label className="form-check-label" htmlFor="customCheck1" />
                    </div>
                  </th>
                  <th>Invoice No.</th>
                  <th>Booking No.</th>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Booking Date</th>
                  <th>Function Name</th>
                  <th>Function Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id={`booking-${item.id}`} />
                        <label className="form-check-label" htmlFor={`booking-${item.id}`}>
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>{item.InvoiceNo}</td>

                    <td className="">{item.BookingNo}</td>

                    <td>
                      <span>{item.CustomerName}</span>
                    </td>

                    <td className="">{item.MobileNumber}</td>
                    <td className="">{item.BookingDate}</td>
                    <td className="">{item.FunctionName}</td>
                    <td className="">{item.FunctionDate}</td>
                    <td className="">
                      <span className="badge bg-success-subtle text-success">{item.Status}</span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <Link href={`/invoices/invoices-details/${item.id}`} className="btn btn-soft-primary btn-sm">
                          <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                        </Link>
                        <EditInvoiceDrawer />
                        <button className="btn btn-soft-danger btn-sm">
                          <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CardFooter className="border-top">
            <nav>
              <ul className="pagination justify-content-end mb-0">
                {/* Previous */}
                <li className={``}>
                  <button className="page-link">Previous</button>
                </li>

                {/* Pages */}
                <li>
                  <button className="page-link">1</button>
                </li>

                {/* Next */}
                <li>
                  <button className="page-link">Next</button>
                </li>
              </ul>
            </nav>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
}

export default Invoices

'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import AddInvoiceDrawer from './addInvoice'
import EditInvoiceDrawer from './editInvoice'
import Link from 'next/link'
import { useGetAllInvoicesQuery, useDeleteInvoiceMutation } from '@/store/invoiceApi'
import Swal from 'sweetalert2'
const Invoices = () => {
  const { data: invoices = [], isLoading } = useGetAllInvoicesQuery()
  const [deleteInvoice] = useDeleteInvoiceMutation()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return invoices
    const q = search.toLowerCase()
    return invoices.filter(
      (inv) =>
        inv.invoiceNo?.toLowerCase().includes(q) ||
        inv.booking?.bookingNo?.toLowerCase().includes(q) ||
        inv.booking?.enquiry?.customerName?.toLowerCase().includes(q) ||
        inv.booking?.enquiry?.mobileNo?.includes(q),
    )
  }, [invoices, search])

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this invoice permanently?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })
    if (!result.isConfirmed) return
    try {
      await deleteInvoice(id).unwrap()
      toast.success('Invoice deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete invoice')
    }
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4">All Invoices List</CardTitle>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <AddInvoiceDrawer />
              <div className="position-relative ms-2 d-none d-md-block">
                <input
                  type="search"
                  className="form-control form-control-sm ps-4"
                  placeholder="Search invoice, booking, customer..."
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="bg-light-subtle">
                <tr>
                  <th>Invoice No.</th>
                  <th>Booking No.</th>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Booking Date</th>
                  <th>Function Name</th>
                  <th>Guests</th>
                  <th>Grand Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={10} className="text-center py-4">
                      Loading invoices...
                    </td>
                  </tr>
                )}

                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-4 text-muted">
                      No invoices found
                    </td>
                  </tr>
                )}

                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td>{item.invoiceNo}</td>
                    <td>{item.booking?.bookingNo}</td>
                    <td>{item.booking?.enquiry?.customerName}</td>
                    <td>{item.booking?.enquiry?.mobileNo}</td>
                    <td>{item.booking?.bookingDate ? new Date(item.booking.bookingDate).toLocaleDateString('en-IN') : '-'}</td>
                    <td>{item.booking?.functionType?.functionName}</td>
                    <td>{item.guests}</td>
                    <td>₹{item.grandTotal}</td>
                    <td>
                      <span className={`badge ${item.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link href={`/invoice/view/${item._id}`} className="btn btn-soft-primary btn-sm">
                          <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                        </Link>
                        <EditInvoiceDrawer invoice={item} />
                        <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
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
                <li>
                  <button className="page-link">Previous</button>
                </li>
                <li>
                  <button className="page-link">1</button>
                </li>
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

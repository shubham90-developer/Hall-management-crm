'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import CustomFlatpickr from '@/components/CustomFlatpickr'
import { useGetAllBookingsQuery } from '@/store/bookingApi'

const VegetablesRequirements = () => {
  const { data: bookings = [], isLoading, isError } = useGetAllBookingsQuery()
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  const dateGroups = useMemo(() => {
    const map: Record<string, number> = {}

    bookings
      .filter((b: any) => b.status !== 'Cancelled')
      .forEach((b: any) => {
        if (!b.functionDate) return
        const dateKey = new Date(b.functionDate).toISOString().slice(0, 10) // YYYY-MM-DD
        map[dateKey] = (map[dateKey] || 0) + 1
      })

    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .filter((group) => {
        if (fromDate && group.date < fromDate) return false
        if (toDate && group.date > toDate) return false
        return true
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1)) // newest first
  }, [bookings, fromDate, toDate])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading bookings</div>

  const hasFilter = fromDate || toDate

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <CardTitle as="h4">🥬 Vegetables Requirements</CardTitle>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div style={{ minWidth: 160 }}>
                <CustomFlatpickr
                  className="form-control form-control-sm"
                  placeholder="From Date"
                  value={fromDate}
                  onChange={(_, dateStr) => setFromDate(dateStr)}
                  options={{ dateFormat: 'Y-m-d' }}
                />
              </div>

              <div style={{ minWidth: 160 }}>
                <CustomFlatpickr
                  className="form-control form-control-sm"
                  placeholder="To Date"
                  value={toDate}
                  onChange={(_, dateStr) => setToDate(dateStr)}
                  options={{ dateFormat: 'Y-m-d' }}
                />
              </div>

              {hasFilter && (
                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={() => {
                    setFromDate('')
                    setToDate('')
                  }}>
                  Clear
                </button>
              )}
            </div>
          </CardHeader>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Function Date</th>
                    <th>Bookings on this Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dateGroups.length > 0 ? (
                    dateGroups.map((group, index) => (
                      <tr key={group.date}>
                        <td>{index + 1}</td>
                        <td>
                          {new Date(group.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary">{group.count} booking(s)</span>
                        </td>

                        <td className="text-nowrap">
                          <div className="d-flex flex-wrap gap-2">
                            <Link href={`/vegitables/${group.date}`} className="btn btn-soft-primary btn-sm" title="View Vegetables Sheet">
                              <IconifyIcon icon="solar:eye-broken" className="fs-16 me-1" />
                              View
                            </Link>
                            <Link
                              href={`/vegitables/${group.date}?autodownload=true`}
                              className="btn btn-soft-danger btn-sm"
                              title="Download Vegetables PDF">
                              <IconifyIcon icon="solar:download-broken" className="fs-16 me-1" />
                              PDF
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        {hasFilter ? 'No bookings found in this date range' : 'No bookings found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default VegetablesRequirements

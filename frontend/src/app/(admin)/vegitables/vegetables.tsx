'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import CustomFlatpickr from '@/components/CustomFlatpickr'
import { useGetAllBookingsQuery } from '@/store/bookingApi'

const VegetablesRequirements = () => {
  const { data: bookings = [], isLoading, isError } = useGetAllBookingsQuery()
  const [dateFilter, setDateFilter] = useState<string>('')

  // one row per distinct function date, with how many bookings share it
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
      .filter((group) => !dateFilter || group.date === dateFilter)
      .sort((a, b) => (a.date < b.date ? 1 : -1)) // newest first
  }, [bookings, dateFilter])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading bookings</div>

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <CardTitle as="h4">🥬 Vegetables Requirements</CardTitle>

            <div className="d-flex align-items-center gap-2">
              <div style={{ minWidth: 200 }}>
                <CustomFlatpickr
                  className="form-control form-control-sm"
                  placeholder="Filter by Function Date"
                  value={dateFilter}
                  onChange={(_, dateStr) => setDateFilter(dateStr)}
                  options={{ dateFormat: 'Y-m-d' }}
                />
              </div>
              {dateFilter && (
                <button type="button" className="btn btn-sm btn-light" onClick={() => setDateFilter('')}>
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
                        {dateFilter ? 'No bookings found on this date' : 'No bookings found'}
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

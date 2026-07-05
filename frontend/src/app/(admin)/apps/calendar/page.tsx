import { lazy, Suspense } from 'react'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import type { Metadata } from 'next'
import PageTItle from '@/components/PageTItle'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const CalendarPage = lazy(() => import('./components/CalendarPage'))

export const metadata: Metadata = { title: 'Schedule' }
const Schedule = () => {
  return (
    <>
      <PageTItle title="CALENDAR" />
      <Row>
        <Col xs={12}>
          <div className="d-flex justify-content-end mb-2">
            <Link href="/bookings" className="btn btn-success btn-xs">
              <IconifyIcon icon="bx:list-ul" className="fs-18 me-2" />
              View All Bookings
            </Link>
          </div>
          <Card>
            <CardBody>
              <Row>
                <Suspense>
                  <CalendarPage />
                </Suspense>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Schedule

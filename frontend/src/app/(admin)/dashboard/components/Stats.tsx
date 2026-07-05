'use client'

import Link from 'next/link'

import { Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap'

import IconifyIcon from '@/components/wrappers/IconifyIcon'

import { useStateData } from '../data'

import { StatType } from '../types'

const variantMap: Record<string, { bg: string; icon: string }> = {
  primary: {
    bg: '#eff6ff',
    icon: '#2563eb',
  },
  success: {
    bg: '#f0fdf4',
    icon: '#16a34a',
  },
  danger: {
    bg: '#fef2f2',
    icon: '#dc2626',
  },
  warning: {
    bg: '#fffbeb',
    icon: '#d97706',
  },
  info: {
    bg: '#f0f9ff',
    icon: '#0284c7',
  },
}
const StatsCard = ({ amount, icon, name, url, variant = 'primary' }: StatType) => {
  const theme = variantMap[variant] || variantMap.primary

  return (
    <Col md={4}>
      <Card
        className="overflow-hidden border-0 shadow-sm"
        style={{
          backgroundColor: theme.bg,
          borderRadius: '16px',
        }}>
        <CardBody>
          <Row className="align-items-center">
            <Col xs={6}>
              <div
                className="avatar-md rounded d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}>
                <IconifyIcon icon={icon} className="fs-24" style={{ color: theme.icon }} />
              </div>
            </Col>

            <Col xs={6} className="text-end">
              <p className="text-muted mb-0 text-truncate">{name}</p>
              <h3 className="text-dark mt-1 mb-0 fw-bold">{amount}</h3>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

const Stats = () => {
  // FIX HERE
  const stateData = useStateData()

  return (
    <Col xxl={12}>
      <Row>
        {stateData?.map((item, idx) => (
          <StatsCard key={idx} {...item} />
        ))}
      </Row>
    </Col>
  )
}

export default Stats

import React from 'react'
import Select, { components } from 'react-select'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'

const otherItemsOptions = [
  { value: 'uplighters', label: 'Uplighters' },
  { value: 'party-dj', label: 'Party DJ' },
  { value: 'party-decoration', label: 'Party Decoration' },
  { value: 'photography', label: 'Photography' },
  { value: 'ceremony-music', label: 'Ceremony Music' },
  { value: 'navi', label: 'Navi' },
  { value: 'bhatji', label: 'Bhatji' },
]

const Option = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="d-flex align-items-center gap-2">
        <input type="checkbox" checked={props.isSelected} readOnly />
        <label>{props.label}</label>
      </div>
    </components.Option>
  )
}

const ManageService = () => {
  return (
    <>
      <Card>
        <CardHeader as={'h4'} className="text-dark">
          Select Extra Menu Items
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={4}>
              <h6>🍽️ Other Items</h6>
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered table-bordered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <td className="text-nowrap">Menu Name</td>
                      <td className="text-nowrap">QTY</td>
                      <td className="text-nowrap">Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                        Papad
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                        Limbu
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                        Meeth
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                        Tak
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                        Maatha
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                        Varan Bhat
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                        Puri
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                        Masala pan
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>

            <Col md={4}>
              <h6>🍽️ sweet Items</h6>
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered table-bordered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <td className="text-nowrap">Menu Name</td>
                      <td className="text-nowrap">QTY</td>
                      <td className="text-nowrap">Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Jalebi
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Gulam Jamun
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Shirkhand
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Amrakhand
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Gajar Halva
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Moong shira
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Dudhi Halva
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>

            <Col md={4}>
              <h6>🍽️ Chat Items</h6>
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered table-bordered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <td className="text-nowrap">Menu Name</td>
                      <td className="text-nowrap">QTY</td>
                      <td className="text-nowrap">Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Masala Dosa
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Pav Bhaji
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Bhel{' '}
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold text-dark text-nowrap" style={{ fontSize: '12px' }}>
                        Ragada Patis
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" />
                      </td>
                      <td>
                        <input type="text" className="form-control" placeholder="" disabled />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}

export default ManageService

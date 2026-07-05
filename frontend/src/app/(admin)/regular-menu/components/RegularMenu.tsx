import React from 'react'
import { Card, CardTitle, Col, Row } from 'react-bootstrap'
import AddMenuDrawer from './AddMenuDrawer'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import EditMenuDrawer from './EditMenuDrawer'

const data = [
  {
    id: 1,
    categoryName: 'Rice',
    foodItemsName: ['steam Rice', 'Veg Rice'],
    status: 'Active',
  },
]

const RegularMenu = () => {
  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4">Regular Menu List</CardTitle>

            <AddMenuDrawer />
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
                  <th>Sr No.</th>
                  <th>Category Name</th>
                  <th>Food Item Name</th>
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

                    <td>{index + 1}</td>

                    <td className="">{item.categoryName}</td>

                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {item.foodItemsName.map((food, idx) => (
                          <span key={idx} className="badge rounded-pill bg-primary-subtle text-primary border px-3 py-1">
                            🍽️ {food}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span className="badge bg-success-subtle text-success">{item.status}</span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <EditMenuDrawer />
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
        </Card>
      </Col>
    </Row>
  )
}

export default RegularMenu

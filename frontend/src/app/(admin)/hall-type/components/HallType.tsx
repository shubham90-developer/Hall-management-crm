'use client'

import React from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import EditHallDrawer from './EditHallDrawer'
import AddHallDrawer from './AddHallDrawer'
import { IHallType, useDeleteHallTypeMutation, useGetAllHallTypeQuery } from '@/store/hallTypeApi'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const data = [
  {
    id: 1,
    hallName: 'Hall 1',
    status: 'Active',
  },
]

const HallType = () => {
  const { data: hallType = [], isLoading, isError } = useGetAllHallTypeQuery()
  const [deleteHallType] = useDeleteHallTypeMutation()

  // delete api
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Hall Type?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteHallType(id).unwrap()
      toast.success('Function deleted successfully')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (isLoading) {
    return <div>Loading....</div>
  }
  if (isError) {
    return <div>Error</div>
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4">All Hall List</CardTitle>

            <AddHallDrawer />
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Hall Name</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {hallType?.length > 0 ? (
                    hallType.map((item: IHallType, index: number) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.hallName}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <EditHallDrawer item={item} />

                            <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No Data Found
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

export default HallType

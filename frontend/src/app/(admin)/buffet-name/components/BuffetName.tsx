'use client'

import React from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import AddBuffetDrawer from './AddBuffetDrawer'
import EditBuffetDrawer from './EditBuffetDrawer'
import { IBuffetName, useDeleteBuffetNameMutation, useGetAllBuggetNameQuery } from '@/store/buffetNameApi'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const BuffetName = () => {
  const { data: buffetNamesData = [], isLoading, isError } = useGetAllBuggetNameQuery()
  const [deleteBuffetName] = useDeleteBuffetNameMutation()
  // delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Buffet Name?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteBuffetName(id).unwrap()
      toast.success('Buffet Name deleted successfully')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error</div>
  }
  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4">All Buffet Name List</CardTitle>

            <AddBuffetDrawer />
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Buffet Name</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {buffetNamesData?.length > 0 ? (
                    buffetNamesData.map((item: IBuffetName, index: number) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.buffetName}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <EditBuffetDrawer item={item} />

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

export default BuffetName

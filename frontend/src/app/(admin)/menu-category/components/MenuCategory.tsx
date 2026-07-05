'use client'

import React from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import AddMenuDrawer from './AddMenuDrawer'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import EditMenuDrawer from './EditMenuDrawer'
import { IMenuCategory, useDeleteMenuCategoryMutation, useGetAllMenuCategoryQuery } from '@/store/menuCategoryApi'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const MenuCategory = () => {
  const { data: menuCategoryData = [], isLoading, isError } = useGetAllMenuCategoryQuery()
  const [deleteMenuCategory] = useDeleteMenuCategoryMutation()

  // delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Menu Category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteMenuCategory(id).unwrap()
      toast.success('Menu Category deleted successfully')
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
            <CardTitle as="h4">All Menu Category List</CardTitle>

            <AddMenuDrawer />
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Category Name</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {menuCategoryData?.length > 0 ? (
                    menuCategoryData.map((item: IMenuCategory, index: number) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.categoryName}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <EditMenuDrawer item={item} />

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

export default MenuCategory

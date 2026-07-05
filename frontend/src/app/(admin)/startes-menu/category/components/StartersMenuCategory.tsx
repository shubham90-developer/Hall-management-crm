'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import AddStartersMenuCategoryDrawer from './AddStartersMenuCategoryDrawer'
import EditStartersMenuCategoryDrawer from './EditStartersMenuCategoryDrawer'
import { IStartersMenuCategory, useDeleteStartersMenuCategoryMutation, useGetAllStartersMenuCategoryQuery } from '@/store/startersMenuCategory'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const StartersMenuCategory = () => {
  const { data: startersMenuCategory = [], isLoading, isError } = useGetAllStartersMenuCategoryQuery()
  const [deleteStartersMenuCategory] = useDeleteStartersMenuCategoryMutation()

  // delete api
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteStartersMenuCategory(id).unwrap()
      toast.success('Category deleted successfully')
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
    <>
      <Row>
        <Col xl={12}>
          <Card>
            <div className="d-flex card-header justify-content-between align-items-center">
              <CardTitle as="h4"> Starters Welcome Drink Category List</CardTitle>
              <div className="d-flex gap-2">
                <AddStartersMenuCategoryDrawer />
              </div>
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
                    {startersMenuCategory.length > 0 ? (
                      startersMenuCategory.map((item: IStartersMenuCategory, index: number) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item.categoryName}</td>

                          <td>
                            <div className="d-flex gap-2">
                              <EditStartersMenuCategoryDrawer item={item} />

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
    </>
  )
}

export default StartersMenuCategory

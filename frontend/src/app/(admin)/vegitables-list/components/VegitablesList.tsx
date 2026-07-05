'use client'

import React from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { IGrosary, useDeleteGrosaryMutation, useGetAllGrosaryListQuery } from '@/store/grosaryApi'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import AddVegitablesDrawer from './AddVegitablesDrawer'
import EditVegitablesDrawer from './EditVegitablesDrawer'
import { IVegitables, useDeleteVegitablesMutation, useGetAllVegitablesListQuery } from '@/store/vegitablesApi'

const VegitablesList = () => {
  const [page, setPage] = React.useState(1)
  const itemPerPage = 10
  const { data: vegitablesData = [], isLoading, isError } = useGetAllVegitablesListQuery()
  const [deleteVegitables] = useDeleteVegitablesMutation()

  // pagniation
  const startIndex = (page - 1) * itemPerPage
  const endIndex = startIndex + itemPerPage
  const currentItems = vegitablesData.slice(startIndex, endIndex)

  const totalPages = Math.ceil(vegitablesData.length / itemPerPage)

  // delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Grosary?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteVegitables(id).unwrap()
      toast.success('Vegitables deleted successfully')
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
            <CardTitle as="h4">All Vegitables List</CardTitle>

            <AddVegitablesDrawer />
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Vegitables Name</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems?.length > 0 ? (
                    currentItems.map((item: IVegitables, index: number) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.vegitablesName}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <EditVegitablesDrawer item={item} />

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

          <CardFooter className="border-top">
            <nav>
              <ul className="pagination justify-content-end mb-0">
                {/* PREVIOUS */}
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button type="button" className="page-link" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                    Previous
                  </button>
                </li>

                {/* PAGE */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1

                  return (
                    <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                      <button type="button" className="page-link" onClick={() => setPage(pageNumber)}>
                        {pageNumber}
                      </button>
                    </li>
                  )
                })}

                {/* NEXT */}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button type="button" className="page-link" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
}

export default VegitablesList

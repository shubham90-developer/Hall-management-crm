'use client'

import React from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useDeleteFunctionTypeMutation, useGetAllFunctionsQuery } from '@/store/functionType'
import type { IFunctionType } from '@/store/functionType'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import EditExternalDrawer from './EditExternalDrawer'
import AddExternalDrawer from './AddExternalDrawer'
import { IExternalItems, useDeleteExternalItemsMutation, useGetAllExternalItemsQuery } from '@/store/externalItemsApi'

const ExternalList = () => {
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const itemPerPage = 10
  const { data: externalItesmData = [], isLoading, isError } = useGetAllExternalItemsQuery()

  const [deleteExternal] = useDeleteExternalItemsMutation()

  // search

  const searchExternlItems = externalItesmData.filter((item: IExternalItems) => {
    return item.itemName.toLowerCase().includes(search.toLowerCase())
  })

  // pagniation
  const startIndex = (page - 1) * itemPerPage
  const endIndex = startIndex + itemPerPage
  const currentItems = searchExternlItems.slice(startIndex, endIndex)

  const totalPages = Math.ceil(searchExternlItems.length / itemPerPage)

  // handle delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteExternal(id).unwrap()
      toast.success('Items deleted successfully')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4">All External Items List</CardTitle>
            <div className="d-flex gap-2 align-items-center">
              {/* SEARCH */}
              <div className="position-relative ms-2 d-none d-md-block">
                <input
                  type="search"
                  className="form-control form-control-sm ps-4"
                  placeholder="Search..."
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <IconifyIcon icon="solar:magnifer-linear" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
              </div>
              <AddExternalDrawer />
            </div>
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Item Name</th>
                    <th>Buffet Category</th> {/* ← add this */}
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems?.length > 0 ? (
                    currentItems.map((item: IExternalItems, index: number) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.itemName}</td>
                        <td>
                          {typeof item.buffet === 'object' ? (item.buffet as any).buffetName : '-'} {/* ← add this */}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <EditExternalDrawer item={item} />
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default ExternalList

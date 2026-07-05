'use client'
import React from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import AddOtherMenuDrawer from './AddOtherMenuDrawer'
import EditOtherMenuDrawer from './EditOtherMenuDrawer'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { IOtherMenu, useDeleteotherMenuMutation, useGetAllotherMenuListQuery } from '@/store/otherMenuApi'

const OtherMenu = () => {
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const itemPerPage = 10

  const { data: otherListData = [], isLoading, isError } = useGetAllotherMenuListQuery()

  const [deleteOtherList] = useDeleteotherMenuMutation()

  // search
  const searchFunction = otherListData.filter((item: IOtherMenu) => {
    return item.itemName.toLowerCase().includes(search.toLowerCase())
  })
  // Pagination
  const startIndex = (page - 1) * itemPerPage
  const endIndex = startIndex + itemPerPage
  const currentItems = searchFunction.slice(startIndex, endIndex)
  console.log('currentItems', currentItems)
  const totalPages = Math.max(1, Math.ceil(searchFunction.length / itemPerPage))

  // Delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Sweet Menu?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteOtherList(id).unwrap()
      toast.success('Other item deleted successfully')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (isError) return <div>Error loading data</div>

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4"> Other Menu List</CardTitle>
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
              <AddOtherMenuDrawer />
            </div>
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Buffet Name</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item: IOtherMenu, index: number) => (
                      <tr key={item._id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{item.buffetName?.map((item) => item.buffetName)}</td>
                        <td>{item.itemName}</td>
                        <td>₹ {item.price}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <EditOtherMenuDrawer item={item} />

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

export default OtherMenu

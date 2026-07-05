'use client'

import React from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import AddChatMenuDrawer from './AddChatMenuDrawer'
import EditChatMenuDrawer from './EditChatMenuDrawer'
import { IChatMenu, useDeleteChatMenuMutation, useGetAllChatMenuQuery } from '@/store/chatMenuApi'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import Link from 'next/link'
const ChatMenu = () => {
  const [page, setPage] = React.useState(1)
  const itemPerPage = 10
  const { data: chatMenuData = [], isLoading, isError } = useGetAllChatMenuQuery()
  const [deleteChatMenu] = useDeleteChatMenuMutation()

  // pagniation
  const startIndex = (page - 1) * itemPerPage
  const endIndex = startIndex + itemPerPage
  const currentItems = chatMenuData.slice(startIndex, endIndex)

  const totalPages = Math.ceil(chatMenuData.length / itemPerPage)

  // delete api
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Chat Menu?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteChatMenu(id).unwrap()
      toast.success('Chat Menu deleted successfully')
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
            <CardTitle as="h4"> Chat Menu List</CardTitle>
            <div className="d-flex gap-2">
              <Link href="/chat-menu-category">
                <button className="btn btn-success d-flex align-items-center gap-2">
                  <IconifyIcon icon="solar:add-circle-broken" />
                  View All Categories
                </button>
              </Link>
              <AddChatMenuDrawer />
            </div>
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Category</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems?.length > 0 ? (
                    currentItems.map((item: IChatMenu, index: number) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.categoryName?.categoryName || '-'}</td>
                        <td>{item.itemName}</td>
                        <td>{item.price}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <EditChatMenuDrawer item={item} />

                            <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
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

export default ChatMenu

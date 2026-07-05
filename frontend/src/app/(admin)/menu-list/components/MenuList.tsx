'use client'

import React from 'react'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import AddMenuDrawer from './AddMenuDrawer'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import EditMenuDrawer from './EditMenuDrawer'
import { IMenuList, useDeleteMenuListMutation, useGetAllMenuListQuery } from '@/store/menuListApi'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const MenuList = () => {
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const itemPerPage = 10

  const { data: menuListData = [], isLoading, isError } = useGetAllMenuListQuery()

  const [deleteMenuList] = useDeleteMenuListMutation()

  // Search
  const searchFunction = menuListData.filter((item: IMenuList) => item.itemName.toLowerCase().includes(search.toLowerCase()))

  // Group Data
  const groupedData = Object.values(
    searchFunction.reduce((acc: any, item: IMenuList) => {
      const buffetIds = (item.buffetName || [])
        .map((b: any) => b._id)
        .sort()
        .join(',')
      const key = `${buffetIds}-${item.categoryName?._id}`

      if (!acc[key]) {
        acc[key] = {
          buffetName: item.buffetName,
          categoryName: item.categoryName,
          items: [],
        }
      }

      acc[key].items.push(item)

      return acc
    }, {}),
  )

  // Pagination
  const startIndex = (page - 1) * itemPerPage
  const endIndex = startIndex + itemPerPage

  const currentItems = groupedData.slice(startIndex, endIndex)

  const totalPages = Math.max(1, Math.ceil(groupedData.length / itemPerPage))

  // Delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this  Menu?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteMenuList(id).unwrap()
      toast.success('Menu item deleted successfully')
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
            <CardTitle as="h4"> Menu List</CardTitle>
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
              <AddMenuDrawer />
            </div>
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Buffet Name</th>
                    <th>Category Name</th>
                    <th>Food Item Name</th>
                    <th>Crockery Name</th>
                    <th>QTY</th>
                    <th>Grosary Name</th>
                    <th>Vegitable Name</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((group: any, index: number) => {
                      const uniqueFoodItems = [...new Set(group.items.map((item: IMenuList) => item.itemName).filter(Boolean))]

                      const uniqueCrockery = [
                        ...new Set(
                          group.items
                            .flatMap((item: IMenuList) =>
                              Array.isArray(item.crocekryName)
                                ? item.crocekryName.map((g: any) => (g?.item?.crocekryName ? `${g.item.crocekryName} (${g.qty || 0})` : null))
                                : [],
                            )
                            .filter(Boolean),
                        ),
                      ]
                      const uniqueGrocery = [
                        ...new Set(
                          group.items
                            .flatMap((item: IMenuList) =>
                              Array.isArray(item.grosaryName)
                                ? item.grosaryName.map((g: any) => (g?.item?.grosaryName ? `${g.item.grosaryName} (${g.qty || 0})` : null))
                                : [],
                            )
                            .filter(Boolean),
                        ),
                      ]
                      const uniqueVegitables = [
                        ...new Set(
                          group.items
                            .flatMap((item: IMenuList) =>
                              Array.isArray(item.vegitablesName)
                                ? item.vegitablesName.map((g: any) => (g?.item?.vegitablesName ? `${g.item.vegitablesName} (${g.qty || 0})` : null))
                                : [],
                            )
                            .filter(Boolean),
                        ),
                      ]

                      return (
                        <tr key={index}>
                          <td>{startIndex + index + 1}</td>

                          <td className="text-nowrap">
                            <div className="d-flex flex-wrap gap-1">
                              {(group.buffetName || []).map((b: any) => (
                                <span key={b._id} className="badge bg-secondary-subtle text-dark">
                                  {b.buffetName}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="text-nowrap">
                            <strong>{group.categoryName?.categoryName}</strong>
                          </td>

                          {/* Food Items */}
                          <td className="text-nowrap">
                            <div className="d-flex flex-wrap gap-1">
                              {uniqueFoodItems.map((name: any) => (
                                <span key={name} className="badge bg-primary-subtle text-primary">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Crockery */}
                          <td className="text-nowrap">
                            <div className="d-flex flex-wrap gap-1">
                              {uniqueCrockery.map((name: any) => (
                                <span key={name} className="badge bg-success-subtle text-success">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Qty */}
                          <td className="text-nowrap">
                            <div className="d-flex flex-wrap gap-1">
                              {[...new Set(group.items.map((item: IMenuList) => item.qty).filter(Boolean))].map((qty: any) => (
                                <span key={qty} className="badge bg-warning-subtle text-dark">
                                  {qty}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Grocery */}
                          <td className="text-nowrap">
                            <div className="d-flex flex-wrap gap-1">
                              {uniqueGrocery.map((name: any) => (
                                <span key={name} className="badge bg-info-subtle text-info">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Vegitables */}
                          <td className="text-nowrap">
                            <div className="d-flex flex-wrap gap-1">
                              {uniqueVegitables.map((name: any) => (
                                <span key={name} className="badge bg-info-subtle text-info">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="text-nowrap">
                            <div className="d-flex flex-wrap gap-2">
                              {group.items.map((item: IMenuList) => (
                                <div key={item._id} className="d-flex gap-1">
                                  <EditMenuDrawer item={item} />

                                  <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
                                    <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
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

export default MenuList

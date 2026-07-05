'use client'

import React from 'react'
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import AddStartersMenuDrawer from './AddStartersMenuDrawer'
import EditStartersMenuDrawer from './EditStartersMenuDrawer'
import Link from 'next/link'
import { IStartersMenu, useDeleteStartersMenuMutation, useGetAllStartersMenuQuery } from '@/store/startersMenuApi'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const StartersMenu = () => {
  const { data: startersMenu = [], isLoading, isError } = useGetAllStartersMenuQuery()
  const [deleteStartersMenu] = useDeleteStartersMenuMutation()

  const groupedData = Object.values(
    startersMenu.reduce((acc: any, item: IStartersMenu) => {
      const key = `${item.categoryName?._id}-${item.price}`

      if (!acc[key]) {
        acc[key] = {
          categoryName: item.categoryName,
          price: item.price,
          items: [],
          records: [],
        }
      }

      acc[key].items.push(item.itemName)
      acc[key].records.push(item)

      return acc
    }, {}),
  )

  // delete api
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Starters Menu?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteStartersMenu(id).unwrap()
      toast.success('Starters Menu deleted successfully')
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
            <CardTitle as="h4"> Starters Welcome Drink Menu List</CardTitle>
            <div className="d-flex gap-2">
              <Link href="/startes-menu/category">
                <button className="btn btn-success d-flex align-items-center gap-2">
                  <IconifyIcon icon="solar:add-circle-broken" />
                  View All Categories
                </button>
              </Link>
              <AddStartersMenuDrawer />
            </div>
          </div>

          <CardBody>
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Sr No.</th>
                    <th>Category Name</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {startersMenu.length > 0 ? (
                    startersMenu.map((item: IStartersMenu, index: number) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.categoryName?.categoryName}</td>
                        <td>{item.itemName}</td>
                        <td>₹ {item.price}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <EditStartersMenuDrawer item={item} />

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

export default StartersMenu

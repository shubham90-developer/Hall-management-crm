'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toast } from 'react-toastify'
import { useCreateStartersMenuMutation } from '@/store/startersMenuApi'
import { useGetAllStartersMenuCategoryQuery } from '@/store/startersMenuCategory'

const AddStartersMenuDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    categoryName: '',
    itemName: '',
    price: '',
    status: 'Active',
  })

  // api
  const [createStartersMenu, { isLoading }] = useCreateStartersMenuMutation()
  const { data: category = [] } = useGetAllStartersMenuCategoryQuery()

  //  handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await createStartersMenu(formData as any).unwrap()
      toast.success('Starters Menu added successfully')
      setOpen(false)
      setFormData({
        categoryName: '',
        itemName: '',
        price: '',
        status: 'Active',
      })
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Starters Menu Item
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '420px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
        }}>
        {/* HEADER */}
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold"> Add Item </h5>

          <button
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* BODY */}
          <div className="p-3">
            {/* category */}
            <div className="mb-3">
              <label className="form-label">Select Category</label>

              <select className="form-select" name="categoryName" value={formData.categoryName} onChange={handleChange}>
                <option value="">🍽️ Choose Your Menu</option>

                {category?.map((item: any) => (
                  <option key={item._id} value={item._id}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
            </div>
            {/* item Name */}
            <div className="mb-3">
              <label className="form-label"> Item Name</label>

              <input type="text" className="form-control" placeholder="" name="itemName" value={formData.itemName} onChange={handleChange} />
            </div>

            {/* item price */}
            <div className="mb-3">
              <label className="form-label"> Item Price</label>

              <input type="text" className="form-control" placeholder="" name="price" value={formData.price} onChange={handleChange} />
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" /> {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddStartersMenuDrawer

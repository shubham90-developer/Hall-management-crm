'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toast } from 'react-toastify'
import { useCreateChatMenuMutation } from '@/store/chatMenuApi'
import { useGetAllChatMenuCategoryQuery } from '@/store/chatMenuCategoryApi'
import Select from 'react-select'

const AddChatMenuDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    categoryName: '',
    itemName: '',
    price: '',
    status: 'Active',
  })

  // api
  const [createChatMenu, { isLoading }] = useCreateChatMenuMutation()
  const { data: categoryList = [] } = useGetAllChatMenuCategoryQuery()

  const categoryOptions = categoryList.map((item) => ({ value: item._id, label: item.categoryName }))

  //  handlechange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await createChatMenu(formData as any).unwrap()
      toast.success('Item added successfully')
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
        Add Chat Menu Item
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

        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
              e.preventDefault()
            }
          }}>
          {/* BODY */}
          <div className="p-3">
            {/* category */}
            <div className="mb-3">
              <label className="form-label">Category</label>
              <Select
                classNamePrefix="react-select"
                options={categoryOptions}
                placeholder="Select Category"
                value={categoryOptions.find((option) => option.value === formData.categoryName) || null}
                onChange={(selected: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryName: selected ? selected.value : '',
                  }))
                }
              />
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
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" /> {isLoading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddChatMenuDrawer

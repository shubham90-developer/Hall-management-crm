'use client'

import React, { useEffect, useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toast } from 'react-toastify'
import { useGetAllExternalItemsByIdQuery, useUpdateExternalItemsMutation } from '@/store/externalItemsApi'
import { useGetAllBuggetNameQuery } from '@/store/buffetNameApi'

const EditExternalDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    itemName: '',
    buffet: '',
    status: 'Active',
  })

  const { data: externalItems, isLoading } = useGetAllExternalItemsByIdQuery(item._id)
  const [updateExternalItems, { isLoading: updateLoading }] = useUpdateExternalItemsMutation()
  const { data: buffetList = [] } = useGetAllBuggetNameQuery()

  useEffect(() => {
    if (externalItems) {
      setFormData({
        itemName: externalItems.itemName || '',
        buffet: typeof externalItems.buffet === 'object' ? (externalItems.buffet as any)._id : externalItems.buffet || '',
        status: externalItems.status || 'Active',
      })
    }
  }, [externalItems])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await updateExternalItems({ id: item._id, data: formData as any }).unwrap()
      toast.success('Item updated successfully')
      setOpen(false)
      setFormData({ itemName: '', buffet: '', status: 'Active' })
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button className="btn btn-soft-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
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
          <h5 className="mb-0 fw-bold">Edit Item</h5>
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
            {/* Item Name */}
            <div className="mb-3">
              <label className="form-label">Item Name</label>
              <input type="text" className="form-control" placeholder="" name="itemName" value={formData.itemName} onChange={handleChange} />
            </div>

            {/* Buffet Category */}
            <div className="mb-3">
              <label className="form-label">Buffet Category</label>
              <select className="form-select" name="buffet" value={formData.buffet} onChange={handleChange}>
                <option value="">Select Buffet</option>
                {buffetList.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.buffetName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary w-100" type="submit" disabled={updateLoading}>
              <IconifyIcon icon="solar:diskette-broken" /> {updateLoading ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditExternalDrawer

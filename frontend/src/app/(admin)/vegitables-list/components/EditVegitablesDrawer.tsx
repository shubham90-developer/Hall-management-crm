'use client'

import React, { useEffect, useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetGrosaryByIdQuery, useUpdateGrosaryMutation } from '@/store/grosaryApi'
import { toast } from 'react-toastify'
import { useGetVegitablesByIdQuery, useUpdateVegitablesMutation } from '@/store/vegitablesApi'

const EditVegitablesDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    vegitablesName: '',
    status: 'Active',
  })

  // api
  const { data: vegitablesData, isLoading } = useGetVegitablesByIdQuery(item._id)
  const [updateVegitables] = useUpdateVegitablesMutation()

  // data fetch
  useEffect(() => {
    if (vegitablesData) {
      setFormData({
        vegitablesName: vegitablesData.vegitablesName,
        status: vegitablesData.status,
      })
    }
  }, [vegitablesData])

  // handlechange
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
      await updateVegitables({
        id: item._id,
        data: formData as any,
      }).unwrap()
      toast.success('Grosary updated successfully')
      setOpen(false)
      setFormData({
        vegitablesName: '',
        status: 'Active',
      })
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
          <h5 className="mb-0 fw-bold"> Edit Vegitables </h5>

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
            {/* Vegitables Name */}
            <div className="mb-3">
              <label className="form-label">Vegitables Name</label>

              <input
                type="text"
                className="form-control"
                placeholder=""
                name="vegitablesName"
                value={formData.vegitablesName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" /> {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditVegitablesDrawer

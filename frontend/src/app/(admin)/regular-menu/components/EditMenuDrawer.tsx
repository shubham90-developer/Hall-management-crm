'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const EditMenuDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    categoryName: '',
    status: 'Active',
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (!form.categoryName) return

    onAdd?.(form)

    setForm({
      categoryName: '',
      status: 'Active',
    })

    setOpen(false)
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
          <h5 className="mb-0 fw-bold"> Edit Regular Menu </h5>

          <button
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-3">
          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Select Category</label>

            <select className="form-select">
              <option value="">Select Category</option>

              {/* Rice */}
              <option value="rice">🍚 Rice</option>

              {/* Vegetables */}
              <option value="dry-vegetable">🥦 Dry Vegetable</option>
              <option value="gravy-vegetable">🍛 Gravy Vegetable</option>

              {/* Usal */}
              <option value="usal">🌱 Usal</option>

              {/* Farsan */}
              <option value="farsan">🍢 Farsan</option>

              {/* Salad */}
              <option value="salad">🥗 Salad</option>

              {/* Chutney */}
              <option value="chutney">🫙 Chutney</option>

              {/* Pickle */}
              <option value="pickle">🥒 Pickle</option>

              {/* Sweet */}
              <option value="sweet">🍮 Sweet</option>

              {/* Drinks */}
              <option value="drinks">🥤 Drinks</option>
            </select>
          </div>

          {/* item Name */}
          <div className="mb-3">
            <label className="form-label">Food Item Name</label>

            <input type="text" className="form-control" placeholder="" name="categoryName" value={form.categoryName} onChange={handleChange} />
          </div>

          {/* Status */}
          <div className="mb-3">
            <label className="form-label">Status</label>

            <select className="form-select" name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 border-top d-flex gap-2">
          <button className="btn btn-light w-100" onClick={() => setOpen(false)}>
            Cancel
          </button>

          <button className="btn btn-primary w-100" onClick={handleSubmit}>
            <IconifyIcon icon="solar:diskette-broken" /> Update
          </button>
        </div>
      </div>
    </>
  )
}

export default EditMenuDrawer

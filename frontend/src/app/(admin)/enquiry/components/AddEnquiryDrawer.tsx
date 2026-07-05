'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toast } from 'react-toastify'
import { useGetAllFunctionsQuery } from '@/store/functionType'
import { useCreateEnquiryMutation } from '@/store/enquiryApi'

const AddEnquiryDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    functionName: '',
    customerName: '',
    mobileNo: '',
    alternateMobileNo: '',
    email: '',
    status: 'Active',
  })

  // api
  const { data: functionData } = useGetAllFunctionsQuery()
  const [createEnquiry, { isLoading }] = useCreateEnquiryMutation()

  //  handle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
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
      await createEnquiry(formData as any).unwrap()
      toast.success('Enquiry added successfully')
      setOpen(false)
      setFormData({
        functionName: '',
        customerName: '',
        mobileNo: '',
        alternateMobileNo: '',
        email: '',
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
        Add Enquiry
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
          <h5 className="mb-0 fw-bold"> Add Enquiry </h5>

          <button
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <form className="p-3" onSubmit={handleSubmit}>
          {/* Customer  Name */}
          <div className="mb-3">
            <label className="form-label">Customer Name</label>

            <input type="text" className="form-control" placeholder="" name="customerName" value={formData.customerName} onChange={handleChange} />
          </div>
          {/* mobile    */}
          <div className="mb-3">
            <label className="form-label">Mobile no</label>

            <input type="text" className="form-control" placeholder="" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
          </div>

          {/*Alternate mobile    */}
          <div className="mb-3">
            <label className="form-label">Alternate Mobile no</label>

            <input
              type="text"
              className="form-control"
              placeholder=""
              name="alternateMobileNo"
              value={formData.alternateMobileNo}
              onChange={handleChange}
            />
          </div>

          {/* email    */}
          <div className="mb-3">
            <label className="form-label">Email</label>

            <input type="email" className="form-control" placeholder="" name="email" value={formData.email} onChange={handleChange} />
          </div>

          {/* function    */}
          <div className="mb-3">
            <label className="form-label">Function Type</label>

            <select className="form-select" name="functionName" value={formData.functionName} onChange={handleChange}>
              <option value="">Select Function Type</option>

              {functionData?.map((item: any) => (
                <option key={item._id} value={item._id}>
                  {item.functionName}
                </option>
              ))}
            </select>
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" /> {isLoading ? 'Adding...' : 'Add Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddEnquiryDrawer

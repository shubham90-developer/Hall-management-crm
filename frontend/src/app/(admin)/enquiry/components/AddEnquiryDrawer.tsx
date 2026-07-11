'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toast } from 'react-toastify'
import { useGetAllFunctionsQuery } from '@/store/functionType'
import { useCreateEnquiryMutation } from '@/store/enquiryApi'
import CustomFlatpickr from '@/components/CustomFlatpickr'

const initialFormState = {
  functionName: '',
  customerName: '',
  mobileNo: '',
  alternateMobileNo: '',
  email: '',
  date1: '',
  date2: '',
  date3: '',
  guestCount: '',
  notes: '',
  isJain: false,
  status: 'Pending',
}

const AddEnquiryDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState(initialFormState)

  // api
  const { data: functionData } = useGetAllFunctionsQuery()
  const [createEnquiry, { isLoading }] = useCreateEnquiryMutation()

  //  handle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
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
      const payload = {
        ...formData,

        guestCount: formData.guestCount ? Number(formData.guestCount) : undefined,
        date1: formData.date1 || undefined,
        date2: formData.date2 || undefined,
        date3: formData.date3 || undefined,
      }

      await createEnquiry(payload as any).unwrap()
      toast.success('Enquiry added successfully')
      setOpen(false)
      setFormData(initialFormState)
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
          width: '650px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
          overflowY: 'auto',
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
          <div className="row g-3">
            {/* Customer Name */}
            <div className="col-md-6">
              <label className="form-label">Customer Name</label>
              <input type="text" className="form-control" placeholder="" name="customerName" value={formData.customerName} onChange={handleChange} />
            </div>

            {/* mobile */}
            <div className="col-md-6">
              <label className="form-label">Mobile no</label>
              <input type="text" className="form-control" placeholder="" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
            </div>

            {/* Alternate mobile */}
            <div className="col-md-6">
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

            {/* email */}
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="" name="email" value={formData.email} onChange={handleChange} />
            </div>

            {/* dates */}
            <div className="col-md-4">
              <label className="form-label">Date 1</label>
              <CustomFlatpickr
                className="form-control"
                placeholder="Select Date"
                options={{ enableTime: false }}
                value={formData.date1}
                onChange={(_, dateStr) => setFormData((prev) => ({ ...prev, date1: dateStr }))}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Date 2</label>
              <CustomFlatpickr
                className="form-control"
                placeholder="Select Date"
                options={{ enableTime: false }}
                value={formData.date2}
                onChange={(_, dateStr) => setFormData((prev) => ({ ...prev, date2: dateStr }))}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Date 3</label>
              <CustomFlatpickr
                className="form-control"
                placeholder="Select Date"
                options={{ enableTime: false }}
                value={formData.date3}
                onChange={(_, dateStr) => setFormData((prev) => ({ ...prev, date3: dateStr }))}
              />
            </div>

            {/* isJain */}
            <div className="col-md-6">
              <label className="form-label">Jain Food Required</label>
              <select
                className="form-select"
                name="isJain"
                value={String(formData.isJain)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isJain: e.target.value === 'true',
                  }))
                }>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            {/* guest count */}
            <div className="col-md-6">
              <label className="form-label">Approximate Guest Count</label>
              <input
                type="number"
                min={0}
                className="form-control"
                placeholder=""
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
              />
            </div>

            {/* status */}
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Hold">Hold</option>
              </select>
            </div>

            {/* function */}
            <div className="col-md-6">
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

            {/* notes */}
            <div className="col-md-12">
              <label className="form-label">Additional Notes</label>
              <textarea className="form-control" rows={3} name="notes" value={formData.notes} onChange={handleChange} />
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2 mt-3">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" /> {isLoading ? 'Adding...' : 'Add Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddEnquiryDrawer

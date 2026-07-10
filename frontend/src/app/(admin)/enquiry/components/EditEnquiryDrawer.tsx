'use client'

import React, { useEffect, useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toast } from 'react-toastify'
import { useGetEnquiryByIdQuery, useUpdateEnquiryMutation } from '@/store/enquiryApi'
import { useGetAllFunctionsQuery } from '@/store/functionType'

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

// Mongo returns full ISO strings (2026-08-15T00:00:00.000Z),
// but <input type="date"> only accepts YYYY-MM-DD
const toDateInputValue = (value?: string) => {
  if (!value) return ''
  return value.slice(0, 10)
}

const EditEnquiryDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState(initialFormState)

  // api
  const { data: functionData } = useGetAllFunctionsQuery()
  const { data: enquiryData, isLoading } = useGetEnquiryByIdQuery(item._id)
  const [updateEnquiry] = useUpdateEnquiryMutation()

  // get data
  useEffect(() => {
    if (enquiryData) {
      setFormData({
        functionName: enquiryData.functionName ? enquiryData.functionName._id : '',
        customerName: enquiryData.customerName || '',
        mobileNo: enquiryData.mobileNo || '',
        alternateMobileNo: enquiryData.alternateMobileNo || '',
        email: enquiryData.email || '',
        date1: toDateInputValue(enquiryData.date1),
        date2: toDateInputValue(enquiryData.date2),
        date3: toDateInputValue(enquiryData.date3),
        guestCount: enquiryData.guestCount != null ? String(enquiryData.guestCount) : '',
        notes: enquiryData.notes || '',
        isJain: enquiryData.isJain || false,
        status: enquiryData.status || 'Pending',
      })
    }
  }, [enquiryData])

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

      await updateEnquiry({
        id: item._id,
        data: payload as any,
      }).unwrap()
      toast.success('Enquiry updated successfully')
      setOpen(false)
      setFormData(initialFormState)
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
          overflowY: 'auto',
        }}>
        {/* HEADER */}
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold"> Edit Enquiry </h5>

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

          {/* dates    */}
          <div className="mb-3">
            <label className="form-label">Date 1</label>
            <input type="date" className="form-control" name="date1" value={formData.date1} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Date 2</label>
            <input type="date" className="form-control" name="date2" value={formData.date2} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Date 3</label>
            <input type="date" className="form-control" name="date3" value={formData.date3} onChange={handleChange} />
          </div>
          {/* isJain */}
          <div className="mb-3">
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
          {/* guest count    */}
          <div className="mb-3">
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

          {/* notes    */}
          <div className="mb-3">
            <label className="form-label">Additional Notes</label>
            <textarea className="form-control" rows={3} name="notes" value={formData.notes} onChange={handleChange} />
          </div>

          {/* status    */}
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Hold">Hold</option>
            </select>
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
              <IconifyIcon icon="solar:diskette-broken" /> {isLoading ? 'Updating...' : 'Update Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditEnquiryDrawer

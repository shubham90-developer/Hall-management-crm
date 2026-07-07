'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Col, Row } from 'react-bootstrap'
import Select, { components } from 'react-select'
import { useCreateotherMenuMutation } from '@/store/otherMenuApi'
import { useGetAllBuggetNameQuery } from '@/store/buffetNameApi'
import { useGetAllMenuCategoryQuery } from '@/store/menuCategoryApi'
import { useGetAllCrockeryListQuery } from '@/store/crockeryApi'
import { useGetAllGrosaryListQuery } from '@/store/grosaryApi'
import { toast } from 'react-toastify'
import { useCreateMenuListMutation } from '@/store/menuListApi'
import { useGetAllVegitablesListQuery } from '@/store/vegitablesApi'

type QtyItem = { item: string; qty: string }

const AddMenuDrawer = ({ onAdd }: any) => {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    buffetName: [] as string[],
    categoryName: '',
    itemName: '',
    crocekryName: [] as QtyItem[],
    qty: '',
    grosaryName: [] as QtyItem[],
    vegitablesName: [] as QtyItem[],
    status: 'Active',
  })

  // api
  const [createMenuList, { isLoading }] = useCreateMenuListMutation()
  const { data: buffetName = [] } = useGetAllBuggetNameQuery()
  const { data: categoryName = [] } = useGetAllMenuCategoryQuery()
  const { data: crockeryName = [] } = useGetAllCrockeryListQuery()
  const { data: grosaryName = [] } = useGetAllGrosaryListQuery()
  const { data: vegitablesName = [] } = useGetAllVegitablesListQuery()

  //  handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleQtyInputChange = (field: 'crocekryName' | 'grosaryName' | 'vegitablesName', id: string, qty: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((entry) => (entry.item === id ? { ...entry, qty } : entry)),
    }))
  }

  const handleQtyCheckboxToggle = (field: 'crocekryName' | 'grosaryName' | 'vegitablesName', id: string) => {
    setFormData((prev) => {
      const exists = prev[field].some((e) => e.item === id)
      const updated = exists ? prev[field].filter((e) => e.item !== id) : [...prev[field], { item: id, qty: '' }]
      return { ...prev, [field]: updated }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await createMenuList(formData as any).unwrap()
      toast.success('Menu added successfully')
      setOpen(false)
      setFormData({
        buffetName: [] as string[],
        categoryName: '',
        itemName: '',
        crocekryName: [] as QtyItem[],
        qty: '',
        grosaryName: [] as QtyItem[],
        vegitablesName: [] as QtyItem[],
        status: 'Active',
      })
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const buffetOptions =
    buffetName?.map((item: any) => ({
      value: item._id,
      label: item.buffetName,
    })) || []

  const vegitablesOptions =
    vegitablesName?.map((item: any) => ({
      value: item._id,
      label: item.vegitablesName,
    })) || []

  const crockeryOptions =
    crockeryName?.map((item: any) => ({
      value: item._id,
      label: item.crocekryName,
    })) || []

  const groceryOptions =
    grosaryName?.map((item: any) => ({
      value: item._id,
      label: item.grosaryName,
    })) || []

  return (
    <>
      {/* OPEN BUTTON */}
      <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Menu
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
          width: '820px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
          overflowY: 'auto',
        }}>
        {/* HEADER */}
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold"> Add Menu </h5>

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
            <Row>
              <Col md={4}>
                {/* item Name */}
                <div className="mb-3">
                  <label className="form-label">Food Item Name</label>

                  <input type="text" className="form-control" placeholder="" name="itemName" value={formData.itemName} onChange={handleChange} />
                </div>
              </Col>
              <Col md={4}>
                {/* Buffet Name */}
                <div className="mb-3">
                  <label className="form-label">Buffet Name</label>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    classNamePrefix="react-select"
                    options={buffetOptions}
                    placeholder="🍽️ Choose Buffet(s)"
                    value={buffetOptions.filter((option) => formData.buffetName?.includes(option.value))}
                    onChange={(selected: any) =>
                      setFormData((prev) => ({
                        ...prev,
                        buffetName: selected ? selected.map((item: any) => item.value) : [],
                      }))
                    }
                    formatOptionLabel={(data, { selectValue }) => (
                      <div className="d-flex align-items-center gap-2">
                        <input type="checkbox" checked={selectValue.some((item: any) => item.value === data.value)} readOnly />
                        <span>{data.label}</span>
                      </div>
                    )}
                  />
                </div>
              </Col>
              <Col md={4}>
                {/* Category */}
                <div className="mb-3">
                  <label className="form-label">Select Category</label>

                  <select className="form-select" name="categoryName" value={formData.categoryName} onChange={handleChange}>
                    <option value="">🍽️ Choose Your Category</option>

                    {categoryName?.map((item: any) => (
                      <option key={item._id} value={item._id}>
                        {item.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col md={12}>
                {/* QTY */}
                <div className="mb-3">
                  <label className="form-label">QTY</label>

                  <input type="text" className="form-control" placeholder="" name="qty" value={formData.qty} onChange={handleChange} />
                </div>
              </Col>
              <Col md={4}>
                {/* Crockery Name */}
                <div className="mb-3">
                  <label className="form-label">🍽️ Crockery Name</label>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered mb-0">
                      <thead className="bg-light-subtle">
                        <tr>
                          <th style={{ width: 20 }}></th>
                          <th>Name</th>
                          <th style={{ width: '30%' }}>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {crockeryOptions.map((option) => {
                          const entry = formData.crocekryName.find((c) => c.item === option.value)
                          const isChecked = !!entry
                          return (
                            <tr key={option.value}>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={isChecked}
                                    onChange={() => handleQtyCheckboxToggle('crocekryName', option.value)}
                                  />
                                </div>
                              </td>
                              <td>{option.label}</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  disabled={!isChecked}
                                  value={entry?.qty || ''}
                                  onChange={(e) => handleQtyInputChange('crocekryName', option.value, e.target.value)}
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>

              <Col md={4}>
                {/* Grosary Name */}
                <div className="mb-3">
                  <label className="form-label">🍚 Grosary Name</label>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered mb-0">
                      <thead className="bg-light-subtle">
                        <tr>
                          <th style={{ width: 20 }}></th>
                          <th>Name</th>
                          <th style={{ width: '30%' }}>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groceryOptions.map((option) => {
                          const entry = formData.grosaryName.find((g) => g.item === option.value)
                          const isChecked = !!entry
                          return (
                            <tr key={option.value}>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={isChecked}
                                    onChange={() => handleQtyCheckboxToggle('grosaryName', option.value)}
                                  />
                                </div>
                              </td>
                              <td>{option.label}</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  disabled={!isChecked}
                                  value={entry?.qty || ''}
                                  onChange={(e) => handleQtyInputChange('grosaryName', option.value, e.target.value)}
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>

              <Col md={4}>
                {/* vegitables Name */}
                <div className="mb-3">
                  <label className="form-label">🥦 Vegetables Name</label>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered mb-0">
                      <thead className="bg-light-subtle">
                        <tr>
                          <th style={{ width: 20 }}></th>
                          <th>Name</th>
                          <th style={{ width: '30%' }}>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vegitablesOptions.map((option) => {
                          const entry = formData.vegitablesName.find((v) => v.item === option.value)
                          const isChecked = !!entry
                          return (
                            <tr key={option.value}>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={isChecked}
                                    onChange={() => handleQtyCheckboxToggle('vegitablesName', option.value)}
                                  />
                                </div>
                              </td>
                              <td>{option.label}</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  disabled={!isChecked}
                                  value={entry?.qty || ''}
                                  onChange={(e) => handleQtyInputChange('vegitablesName', option.value, e.target.value)}
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" /> {isLoading ? 'Adding...' : 'Add Menu'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddMenuDrawer

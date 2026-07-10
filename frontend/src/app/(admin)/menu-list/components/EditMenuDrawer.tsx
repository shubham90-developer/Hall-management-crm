'use client'

import React, { useEffect, useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Col, Row } from 'react-bootstrap'
import Select, { components } from 'react-select'
import { toast } from 'react-toastify'
import { useGetAllBuggetNameQuery } from '@/store/buffetNameApi'
import { useGetAllMenuCategoryQuery } from '@/store/menuCategoryApi'
import { useGetAllCrockeryListQuery } from '@/store/crockeryApi'
import { useGetAllGrosaryListQuery } from '@/store/grosaryApi'
import { useGetMenuListByIdQuery, useUpdateMenuListMutation } from '@/store/menuListApi'
import { useGetAllVegitablesListQuery } from '@/store/vegitablesApi'

type QtyItem = { item: string; qty: string }

const Option = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="d-flex align-items-center gap-2">
        <input type="checkbox" checked={props.isSelected} readOnly />
        <span>{props.label}</span>
      </div>
    </components.Option>
  )
}

const EditMenuDrawer = ({ item }: any) => {
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    buffetName: [] as string[],
    categoryName: '',
    itemName: '',
    crocekryName: [] as QtyItem[],
    qty: '',
    grosaryName: [] as QtyItem[],
    vegitablesName: [] as QtyItem[],
    description: '',
    status: 'Active',
  })

  // api
  const { data: enquiryData = [] } = useGetMenuListByIdQuery(item._id)
  const [updateEnquiry, { isLoading }] = useUpdateMenuListMutation()
  const { data: buffetName = [] } = useGetAllBuggetNameQuery()
  const { data: categoryName = [] } = useGetAllMenuCategoryQuery()
  const { data: crockeryName = [] } = useGetAllCrockeryListQuery()
  const { data: grosaryName = [] } = useGetAllGrosaryListQuery()
  const { data: vegitablesName = [] } = useGetAllVegitablesListQuery()
  const [menuImageFile, setMenuImageFile] = useState<File | null>(null) // ← add
  const [imagePreview, setImagePreview] = useState<string>('')
  // fetch data
  useEffect(() => {
    if (enquiryData && !Array.isArray(enquiryData)) {
      const data = enquiryData as any

      // helper — converts {item: {...}, qty} entries into {item: id, qty}
      const toQtyItems = (arr: any): QtyItem[] => {
        if (!Array.isArray(arr)) return []
        return arr
          .map((entry: any) => {
            const id = entry?.item?._id || entry?.item || entry?._id
            if (!id) return null
            return { item: id, qty: entry?.qty || '' }
          })
          .filter(Boolean) as QtyItem[]
      }

      setFormData({
        buffetName: Array.isArray(data.buffetName) ? data.buffetName.map((item: any) => item._id) : data.buffetName?._id ? [data.buffetName._id] : [],
        categoryName: data.categoryName?._id || '',
        itemName: data.itemName || '',

        crocekryName: toQtyItems(data.crocekryName),

        qty: data.qty || '',

        grosaryName: toQtyItems(data.grosaryName),

        vegitablesName: toQtyItems(data.vegitablesName),

        description: data.description || '',
        status: data.status || 'Active',
      })
      setImagePreview(data.menuImage || '')
    }
  }, [enquiryData])

  //  handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ── Generic helpers for qty-based multi-selects ──────────────────
  const handleQtySelectChange = (field: 'crocekryName' | 'grosaryName' | 'vegitablesName', selected: any) => {
    const selectedIds: string[] = selected ? selected.map((item: any) => item.value) : []

    setFormData((prev) => {
      const existing = prev[field]
      const updated: QtyItem[] = selectedIds.map((id) => {
        const found = existing.find((e) => e.item === id)
        return found || { item: id, qty: '' }
      })
      return { ...prev, [field]: updated }
    })
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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMenuImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const body = new FormData()
      body.append('itemName', formData.itemName)
      body.append('qty', formData.qty)
      body.append('description', formData.description)
      body.append('categoryName', formData.categoryName)
      body.append('buffetName', JSON.stringify(formData.buffetName))
      body.append('crocekryName', JSON.stringify(formData.crocekryName))
      body.append('grosaryName', JSON.stringify(formData.grosaryName))
      body.append('vegitablesName', JSON.stringify(formData.vegitablesName))

      if (menuImageFile) {
        body.append('menuImage', menuImageFile)
      }

      await updateEnquiry({
        id: item._id,
        data: body as any,
      }).unwrap()

      toast.success('Menu List updated successfully')
      setOpen(false)
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
          width: '820px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
          overflowY: 'auto',
        }}>
        {/* HEADER */}
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold"> Edit Menu </h5>

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
              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label">Menu Image</label>
                  <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="menu preview" style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 6 }} />
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6}>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    name="description"
                    placeholder="Short description of this food item"
                    value={formData.description}
                    onChange={handleChange as any}
                  />
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
                                  placeholder="e.g. 2 pcs"
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
                                  placeholder="e.g. 1 kg"
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
                                  placeholder="e.g. 500 g"
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
              <IconifyIcon icon="solar:diskette-broken" /> {isLoading ? 'Updating...' : 'Update Menu'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditMenuDrawer

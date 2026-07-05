'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardBody, CardTitle, Col, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

// QUILL CSS
// @ts-ignore
import 'react-quill/dist/quill.snow.css'
import { useCreateTermsMutation, useGetTermsQuery, useUpdateTermsMutation } from '@/store/termsApi'

// FIX SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

const MyTerms = () => {
  const [value, setValue] = useState('')

  // GET NOTES
  const { data: notes = [], isLoading, isError, refetch } = useGetTermsQuery()

  // CREATE + UPDATE
  const [createNotes, { isLoading: createLoading }] = useCreateTermsMutation()

  const [updateNotes, { isLoading: updateLoading }] = useUpdateTermsMutation()

  // FIRST NOTE
  const note = notes?.[0]

  // SET EDITOR VALUE
  useEffect(() => {
    if (note?.content) {
      setValue(note.content)
    }
  }, [note])

  // SAVE NOTE
  const handleSave = async () => {
    try {
      // UPDATE EXISTING NOTE
      if (note?._id) {
        await updateNotes({
          _id: note._id,
          content: value,
        }).unwrap()

        toast.success('Terms updated successfully')
      }

      // CREATE NEW NOTE
      else {
        await createNotes({
          content: value,
        }).unwrap()

        toast.success('Terms created successfully')

        refetch()
      }
    } catch (error: any) {
      console.log(error)

      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // LOADING
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" />
      </div>
    )
  }

  // ERROR
  if (isError) {
    return <div className="text-danger text-center py-5">Failed to load notes</div>
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          {/* HEADER */}
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4" className="mb-0">
              Terms & Conditions
            </CardTitle>
          </div>

          {/* BODY */}
          <CardBody>
            <div style={{ height: '300px' }}>
              <ReactQuill theme="snow" value={value} onChange={setValue} style={{ height: '250px' }} />
            </div>

            <div className="d-flex justify-content-end mt-5">
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={createLoading || updateLoading}>
                {createLoading || updateLoading ? 'Saving...' : note?._id ? 'Update ' : 'Create '}
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default MyTerms

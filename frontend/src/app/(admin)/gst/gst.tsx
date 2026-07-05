'use client'

import React, { useEffect } from 'react'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useGetGstQuery, useUpdateGstMutation } from '@/store/gstApi'
import { useNotificationContext } from '@/context/useNotificationContext'

const gstSchema = yup.object({
  gst: yup.number().typeError('GST must be a number').min(0, 'GST cannot be negative').required('GST is required'),
})

type GstFields = yup.InferType<typeof gstSchema>

const GstSettings = () => {
  const { data: gstData, isLoading: fetching } = useGetGstQuery()
  const [updateGst, { isLoading: saving }] = useUpdateGstMutation()
  const { showNotification } = useNotificationContext()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GstFields>({
    resolver: yupResolver(gstSchema),
  })

  useEffect(() => {
    if (gstData) {
      reset({ gst: gstData.gst })
    }
  }, [gstData, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateGst({ gst: values.gst }).unwrap()
      showNotification({ message: 'GST updated successfully', variant: 'success' })
    } catch (error: any) {
      showNotification({ message: error?.data?.message || 'Failed to update GST', variant: 'danger' })
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>GST Settings</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <label className="form-label">GST (%)</label>
            <input {...register('gst')} type="number" step="0.01" className="form-control" placeholder="Enter GST percentage" disabled={fetching} />
            {errors.gst && <small className="text-danger">{errors.gst.message}</small>}
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-1" disabled={saving || fetching}>
            {saving ? 'Submitting...' : 'Submit'}
          </button>
        </CardBody>
      </Card>
    </form>
  )
}

export default GstSettings

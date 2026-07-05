'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useChangePasswordMutation, useUpdateLogoMutation, useGetMeQuery } from '@/store/authApi'
import { useNotificationContext } from '@/context/useNotificationContext'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const changePasswordSchema = yup.object({
  username: yup.string().required('Username is required'),
  newPassword: yup.string().min(6).required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm password is required'),
})

type ChangePasswordFields = yup.InferType<typeof changePasswordSchema>

const Settings = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const [updateLogo, { isLoading: isLogoUploading }] = useUpdateLogoMutation()
  const { data: currentUser, refetch: refetchMe } = useGetMeQuery()
  const { showNotification } = useNotificationContext()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFields>({
    resolver: yupResolver(changePasswordSchema),
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleLogoUpload = async () => {
    if (!logoFile) {
      showNotification({ message: 'Please select an image first', variant: 'danger' })
      return
    }

    try {
      const formData = new FormData()
      formData.append('logo', logoFile)

      await updateLogo(formData).unwrap()
      showNotification({ message: 'Logo updated successfully', variant: 'success' })
      setLogoFile(null)
      setLogoPreview(null)
      refetchMe() // pulls the fresh logo URL from server
    } catch (error: any) {
      showNotification({ message: error?.data?.message || 'Failed to update logo', variant: 'danger' })
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePassword({
        username: values.username,
        newPassword: values.newPassword,
      }).unwrap()
      showNotification({ message: 'Password changed successfully', variant: 'success' })
      reset()
      Cookies.remove('token')
      router.push('auth/sign-in')
    } catch (error: any) {
      showNotification({ message: error?.data?.message || 'Failed to change password', variant: 'danger' })
    }
  })

  // Show newly picked file preview if present, otherwise fall back to saved logo
  const displayImage = logoPreview || currentUser?.logo

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Update Logo</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <label className="form-label">Logo Image</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleLogoChange} />
          </div>
          {displayImage && (
            <div className="mb-3">
              <img src={displayImage} alt="Logo Preview" style={{ maxHeight: 100 }} className="rounded border" />
            </div>
          )}
          <button type="button" className="btn btn-primary w-100 mt-1" disabled={isLogoUploading} onClick={handleLogoUpload}>
            {isLogoUploading ? 'Uploading...' : 'Upload Logo'}
          </button>
        </CardBody>
      </Card>

      <form onSubmit={onSubmit} className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle as={'h4'}>Change Password</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input {...register('username')} type="text" className="form-control" placeholder="Enter Username" />
              {errors.username && <small className="text-danger">{errors.username.message}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input {...register('newPassword')} type="password" className="form-control" placeholder="Enter New Password" />
              {errors.newPassword && <small className="text-danger">{errors.newPassword.message}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input {...register('confirmPassword')} type="password" className="form-control" placeholder="Confirm New Password" />
              {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-1" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </CardBody>
        </Card>
      </form>
    </>
  )
}

export default Settings

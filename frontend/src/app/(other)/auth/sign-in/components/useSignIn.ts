'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Cookies from 'js-cookie'

import { useNotificationContext } from '@/context/useNotificationContext'
import { useLoginMutation } from '@/store/authApi'
import { setCredentials } from '@/store/authSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const loginFormSchema = yup.object({
  email: yup.string().email('Please enter valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

type LoginFormFields = yup.InferType<typeof loginFormSchema>

const useSignIn = () => {
  const [loginUser, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { showNotification } = useNotificationContext()

  const { control, handleSubmit } = useForm<LoginFormFields>({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin123',
    },
  })

  const login = handleSubmit(async (values: LoginFormFields) => {
    try {
      const result = await loginUser(values).unwrap()

      // Save token in cookie so middleware can read it
      Cookies.set('token', result.token, { expires: 7, path: '/' })

      dispatch(setCredentials({ token: result.token, user: result.user }))

      showNotification({
        message: 'Login successful',
        variant: 'success',
      })

      router.push('/apps/calendar')
    } catch (error: any) {
      showNotification({
        message: error?.data?.message || 'Login failed, Please check your email and password',
        variant: 'danger',
      })
    }
  })

  return {
    loading: isLoading,
    login,
    control,
  }
}

export default useSignIn

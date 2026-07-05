import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import { apiSlice } from './apiSlice'
import { roleApi } from './roleApi'
import { settingApi } from './settingApi'
import { termsApi } from './termsApi'
import { functionTypeApi } from './functionType'
import { hallTypeApi } from './hallTypeApi'
import { buffetNameApi } from './buffetNameApi'
import { menuCategoryApi } from './menuCategoryApi'
import { chatMenuApi } from './chatMenuApi'
import { crockeryApi } from './crockeryApi'
import { grosaryApi } from './grosaryApi'
import { otherListApi } from './otherListApi'
import { sweetMenuApi } from './sweetMenuApi'
import { otherMenuApi } from './otherMenuApi'
import { startersMenuCategoryApi } from './startersMenuCategory'
import { startersMenuApi } from './startersMenuApi'
import { MenuListApi } from './menuListApi'
import { enquiryApi } from './enquiryApi'
import { externalItemsApi } from './externalItemsApi'
import { bookingApi } from './bookingApi'
import { vegitablesApi } from './vegitablesApi'
import { gstApi } from './gstApi'
import { invoiceApi } from './invoice'
import { chatMenuCategoryApi } from './chatMenuCategoryApi'
import { authApi } from './authApi'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [enquiryApi.reducerPath]: enquiryApi.reducer,
    [termsApi.reducerPath]: termsApi.reducer,
    [functionTypeApi.reducerPath]: functionTypeApi.reducer,
    [hallTypeApi.reducerPath]: hallTypeApi.reducer,
    [buffetNameApi.reducerPath]: buffetNameApi.reducer,
    [menuCategoryApi.reducerPath]: menuCategoryApi.reducer,
    [chatMenuApi.reducerPath]: chatMenuApi.reducer,
    [crockeryApi.reducerPath]: crockeryApi.reducer,
    [grosaryApi.reducerPath]: grosaryApi.reducer,
    [otherListApi.reducerPath]: otherListApi.reducer,
    [sweetMenuApi.reducerPath]: sweetMenuApi.reducer,
    [otherMenuApi.reducerPath]: otherMenuApi.reducer,
    [startersMenuCategoryApi.reducerPath]: startersMenuCategoryApi.reducer,
    [startersMenuApi.reducerPath]: startersMenuApi.reducer,
    [MenuListApi.reducerPath]: MenuListApi.reducer,
    [externalItemsApi.reducerPath]: externalItemsApi.reducer,
    [vegitablesApi.reducerPath]: vegitablesApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [settingApi.reducerPath]: settingApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [gstApi.reducerPath]: gstApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [chatMenuCategoryApi.reducerPath]: chatMenuCategoryApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware,
      enquiryApi.middleware,
      termsApi.middleware,
      functionTypeApi.middleware,
      hallTypeApi.middleware,
      buffetNameApi.middleware,
      menuCategoryApi.middleware,
      chatMenuApi.middleware,
      crockeryApi.middleware,
      grosaryApi.middleware,
      otherListApi.middleware,
      sweetMenuApi.middleware,
      otherMenuApi.middleware,
      startersMenuCategoryApi.middleware,
      startersMenuApi.middleware,
      vegitablesApi.middleware,
      MenuListApi.middleware,
      externalItemsApi.middleware,
      roleApi.middleware,
      settingApi.middleware,
      bookingApi.middleware,
      gstApi.middleware,
      invoiceApi.middleware,
      chatMenuCategoryApi.middleware,
      authApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

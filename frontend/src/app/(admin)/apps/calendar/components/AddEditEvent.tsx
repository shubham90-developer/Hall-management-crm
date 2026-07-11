'use client'
import CustomFlatpickr from '@/components/CustomFlatpickr'
import { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalHeader, ModalTitle, Button, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useLazySearchEnquiryQuery, IEnquiry } from '@/store/enquiryApi'
import { useGetAllFunctionsQuery } from '@/store/functionType'
import { useGetAllHallTypeQuery } from '@/store/hallTypeApi'
import { useGetAllMenuListQuery } from '@/store/menuListApi'
import { useGetAllsweetMenuListQuery } from '@/store/sweetMenuApi'
import { useGetAllotherMenuListQuery } from '@/store/otherMenuApi'
import { useGetAllStartersMenuQuery } from '@/store/startersMenuApi'
import { useGetAllChatMenuQuery } from '@/store/chatMenuApi'
import { useGetAllOtherListQuery } from '@/store/otherListApi'
import {
  useCreateBookingMutation,
  useUpdateMenuBookingMutation,
  useUpdatePricingBookingMutation,
  useGetBookingByIdQuery,
  useUpdateBasicBookingMutation,
} from '@/store/bookingApi'
import SpecialMenu from '@/app/(admin)/menu-selction/components/SpecialMenu'
import OtherMenu from '@/app/(admin)/menu-selction/components/Othermenu'
import AmountDetails from '@/app/(admin)/menu-selction/components/AmountDetails'
import MenuSelectionDetails from '@/app/(admin)/menu-selction/details/components/MenuSelectionDetails'
import { useGetAllBuggetNameQuery } from '@/store/buffetNameApi'
import { useGetAllExternalItemsQuery } from '@/store/externalItemsApi'
import PricingModal from './PricingModal'
import { IBooking } from '@/store/bookingApi'
import { useRouter } from 'next/navigation'
import { useCreateInvoiceMutation } from '@/store/invoiceApi'
import InvoiceAmountDetails from '@/app/(admin)/invoice/amountDetails'
type TabType = 'booking' | 'menu' | 'view' | 'pricing' | 'invoice'

interface Props {
  open: boolean
  toggle: () => void
  isEditable?: boolean
  selectedDate?: string
  selectedBookingId?: string | null
}

const AddEditEvent = ({ open, toggle, isEditable = false, selectedDate = '', selectedBookingId = null }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType | null>(isEditable ? null : 'booking')
  const [selectedMenu, setSelectedMenu] = useState('')
  const [selectedStarters, setSelectedStarters] = useState<string[]>([])
  const [selectedChatMenu, setSelectedChatMenu] = useState<string[]>([])
  const { data: startersMenuList = [] } = useGetAllStartersMenuQuery()
  const { data: chatMenuList = [] } = useGetAllChatMenuQuery()
  const [menuStep, setMenuStep] = useState(1)
  const [buffetCategories, setBuffetCategories] = useState<string[]>([])
  const [activeBuffetCategory, setActiveBuffetCategory] = useState('')
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [searchName, setSearchName] = useState('')
  const [enquiryList, setEnquiryList] = useState<IEnquiry[]>([])
  const [bookingDate, setBookingDate] = useState('')
  const [isAdvance, setIsAdvance] = useState(false)

  const [mainModalVisible, setMainModalVisible] = useState(true)
  const [showHallPricingModal, setShowHallPricingModal] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<IBooking | null>(null)
  const totalSteps = 8
  const isSpecialMenuTab = selectedMenu === 'starters' || selectedMenu === 'chatmenu'
  const [enquiryDates, setEnquiryDates] = useState<{ date1?: string; date2?: string; date3?: string }>({})
  const router = useRouter()
  const [createInvoice, { isLoading: savingInvoice }] = useCreateInvoiceMutation()

  // ── Invoice tab state (independent from booking's own guests/advance) ──
  const [invoiceGuests, setInvoiceGuests] = useState(0)
  const [invoiceAdvance, setInvoiceAdvance] = useState(0)
  const [invoiceDiscount, setInvoiceDiscount] = useState(0)
  const [invoiceCalculated, setInvoiceCalculated] = useState({
    totalAmount: 0,
    additionalAmount: 0,
    subtotalamount: 0,
    gst: 0,
    grandTotal: 0,
    finalAmount: 0,
    pendingAmount: 0,
  })

  const [basicForm, setBasicForm] = useState({
    enquiryId: '',
    customerName: '',
    mobileNo: '',
    alternateMobileNo: '',
    email: '',
    address: '',
    gstNo: '',
    functionDate: '',
    functionType: '',
    hall: '',
    startTime: '',
    endTime: '',
    advance: 0,
    paymentMethod: '--',
    status: 'Confirmed' as 'Confirmed' | 'Pencil' | 'Cancelled' | 'NB',
  })

  // ── Step 2 State ────────────────────────────────────────────────
  const [menuForm, setMenuForm] = useState({
    Muhurat: '',
    guests: 0,
    seatingArrangement: '',
    mealTime: '',
    menu: [] as string[],
    sweets: [] as string[],
    additional: [] as string[],
    externalItems: [] as string[],
    other: [] as { id: string; startTime: string; endTime: string }[],
  })

  // ── Step 3 State ────────────────────────────────────────────────
  const [pricingForm, setPricingForm] = useState({
    totalAmount: 0,
    additionalAmount: 0,
    specialMenuAmount: 0,
    subtotalamount: 0,
    gst: 0,
    discount: 0,
    grandTotal: 0,
    finalAmount: 0,
    pendingAmount: 0,
  })

  // ── APIs ─────────────────────────────────────────────────────────
  const [searchEnquiry, { data: enquiryResult }] = useLazySearchEnquiryQuery()
  const { data: functionTypes = [] } = useGetAllFunctionsQuery()
  const { data: hallTypes = [] } = useGetAllHallTypeQuery()
  const { data: menuList = [] } = useGetAllMenuListQuery()
  const { data: externalItemsList = [] } = useGetAllExternalItemsQuery()
  const { data: sweetMenuList = [] } = useGetAllsweetMenuListQuery()
  const { data: otherMenuList = [] } = useGetAllotherMenuListQuery()
  const { data: otherList = [] } = useGetAllOtherListQuery()
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation()
  const [updateBasic] = useUpdateBasicBookingMutation()
  const [updateMenu, { isLoading: savingMenu }] = useUpdateMenuBookingMutation()
  const [updatePricing, { isLoading: savingPrice }] = useUpdatePricingBookingMutation()
  const { data: buffetList = [] } = useGetAllBuggetNameQuery()

  // ← Add this below
  useEffect(() => {
    if (buffetList.length > 0 && !selectedMenu) {
      setSelectedMenu(buffetList[0]._id)
    }
  }, [buffetList])
  const { data: existingBooking } = useGetBookingByIdQuery(selectedBookingId!, { skip: !selectedBookingId })
  const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0')
    const m = (minutes % 60).toString().padStart(2, '0')
    return `${h}:${m}`
  }
  const sanitizeIds = (ids: any[]): string[] => ids.map((id) => (typeof id === 'object' ? id._id : id)).filter(Boolean)
  // ── Phone search ─────────────────────────────────────────────────
  useEffect(() => {
    if (phone.length >= 3) searchEnquiry({ phone })
  }, [phone])

  // ── Name search ──────────────────────────────────────────────────
  useEffect(() => {
    if (searchName.length >= 3) searchEnquiry({ name: searchName })
  }, [searchName])

  // ── Handle search result ─────────────────────────────────────────
  useEffect(() => {
    if (!enquiryResult) return
    const list = Array.isArray(enquiryResult) ? enquiryResult : [enquiryResult]
    setEnquiryList(list)
  }, [enquiryResult])

  // ── Prefill form when editing ────────────────────────────────────
  useEffect(() => {
    if (existingBooking && isEditable) {
      setBookingId(existingBooking._id)
      setEnquiryDates({
        date1: existingBooking.enquiry.date1 ? new Date(existingBooking.enquiry.date1).toISOString().split('T')[0] : '',
        date2: existingBooking.enquiry.date2 ? new Date(existingBooking.enquiry.date2).toISOString().split('T')[0] : '',
        date3: existingBooking.enquiry.date3 ? new Date(existingBooking.enquiry.date3).toISOString().split('T')[0] : '',
      })
      setBookingDate(new Date(existingBooking.bookingDate).toLocaleDateString('en-IN'))
      setIsAdvance(existingBooking.advance > 0)
      setBasicForm({
        enquiryId: existingBooking.enquiry._id,
        customerName: existingBooking.enquiry.customerName,
        mobileNo: existingBooking.enquiry.mobileNo,
        alternateMobileNo: existingBooking.enquiry.alternateMobileNo,
        email: existingBooking.enquiry.email,
        address: existingBooking.address,
        gstNo: existingBooking.gstNo || '',
        functionType: existingBooking.functionType._id,
        hall: existingBooking.hall._id,
        startTime: minutesToTime(Number(existingBooking.startTime)),
        endTime: minutesToTime(Number(existingBooking.endTime)),
        advance: existingBooking.advance,
        functionDate: existingBooking.functionDate ? new Date(existingBooking.functionDate).toISOString().split('T')[0] : '',
        paymentMethod: existingBooking.paymentMethod,
        status: existingBooking.status,
      })
      if (existingBooking.menuType === 'starters') {
        setSelectedMenu('starters')
      } else if (existingBooking.menuType === 'chatmenu') {
        setSelectedMenu('chatmenu')
      } else if (existingBooking.menuType === 'customize') {
        setSelectedMenu('customize')
      } else if (existingBooking.selectedBuffetId) {
        setSelectedMenu(
          typeof existingBooking.selectedBuffetId === 'object' ? (existingBooking.selectedBuffetId as any)._id : existingBooking.selectedBuffetId,
        )
      } else if ((existingBooking.starters || []).length > 0) {
        setSelectedMenu('starters')
      } else if ((existingBooking.chatMenu || []).length > 0) {
        setSelectedMenu('chatmenu')
      }
      setMenuForm({
        Muhurat: existingBooking.Muhurat || '',
        mealTime: existingBooking.mealTime || '',
        guests: existingBooking.guests || 0,
        seatingArrangement: existingBooking.seatingArrangement || '',
        menu: sanitizeIds(existingBooking.menu || []),
        sweets: sanitizeIds(existingBooking.sweets || []),
        additional: sanitizeIds(existingBooking.additional || []),
        externalItems: sanitizeIds(existingBooking.externalItems || []),
        other: (existingBooking.other || [])
          .filter((o: any) => o && o.id)
          .map((o: any) => ({
            id: typeof o === 'string' ? o : typeof o.id === 'object' ? o.id._id : o.id,
            startTime: o.startTime || '',
            endTime: o.endTime || '',
          })),
      })
      setPricingForm({
        totalAmount: existingBooking.totalAmount || 0,
        additionalAmount: existingBooking.additionalAmount || 0,
        subtotalamount: existingBooking.subtotalamount || 0,
        specialMenuAmount: existingBooking.specialMenuAmount || 0,
        gst: existingBooking.gst || 0,
        discount: existingBooking.discount || 0,
        grandTotal: existingBooking.grandTotal || 0,
        finalAmount: existingBooking.finalAmount || 0,
        pendingAmount: existingBooking.pendingAmount || 0,
      })
      setSelectedStarters(sanitizeIds(existingBooking.starters || []))
      setSelectedChatMenu(sanitizeIds(existingBooking.chatMenu || []))

      setInvoiceGuests(existingBooking.guests || 0)
      setInvoiceAdvance(existingBooking.advance || 0)

      setActiveTab(null)
    }
  }, [existingBooking, isEditable])

  useEffect(() => {
    if (open) {
      setActiveTab(isEditable ? null : 'booking')
    }
  }, [open, isEditable])
  // ── Reset on modal close ─────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      setActiveTab(null)
      setMenuStep(1)
      setMainModalVisible(true)
      setBookingId(null)
      setPhone('')
      setSearchName('')
      setEnquiryList([])
      setSelectedMenu(buffetList.length > 0 ? buffetList[0]._id : '')
      setBookingDate('')
      setIsAdvance(false)
      setEnquiryDates({})
      setBasicForm({
        enquiryId: '',
        customerName: '',
        mobileNo: '',
        alternateMobileNo: '',
        email: '',
        address: '',
        gstNo: '',
        functionDate: '',
        functionType: '',
        hall: '',
        startTime: '',
        endTime: '',
        advance: 0,
        paymentMethod: '--',
        status: 'Confirmed',
      })
      setMenuForm({
        Muhurat: '',
        guests: 0,
        seatingArrangement: '',
        mealTime: '',
        menu: [],
        sweets: [],
        additional: [],
        externalItems: [],
        other: [] as { id: string; startTime: string; endTime: string }[],
      })
      setSelectedStarters([])
      setSelectedChatMenu([])
      setPricingForm({
        totalAmount: 0,
        additionalAmount: 0,
        subtotalamount: 0,
        specialMenuAmount: 0,
        gst: 0,
        discount: 0,
        grandTotal: 0,
        finalAmount: 0,
        pendingAmount: 0,
      })
    }
  }, [open])

  const autofillEnquiry = (data: IEnquiry) => {
    setPhone(data.mobileNo)
    setEnquiryDates({
      date1: data.date1 ? new Date(data.date1).toISOString().split('T')[0] : '',
      date2: data.date2 ? new Date(data.date2).toISOString().split('T')[0] : '',
      date3: data.date3 ? new Date(data.date3).toISOString().split('T')[0] : '',
    })
    setBasicForm((prev) => ({
      ...prev,
      enquiryId: data._id,
      customerName: data.customerName,
      mobileNo: data.mobileNo,
      alternateMobileNo: data.alternateMobileNo,
      email: data.email,
      functionType: data.functionName?._id || '',
      functionDate: data.date1 ? new Date(data.date1).toISOString().split('T')[0] : '',
    }))
  }

  // ── Save Step 1 ──────────────────────────────────────────────────
  const handleSaveBooking = async () => {
    try {
      if (!basicForm.enquiryId) {
        toast.error('Please search and select a customer')
        return
      }
      if (!basicForm.functionDate) {
        toast.error('Function Date is required')
        return
      }
      if (!basicForm.functionDate) {
        toast.error('Function Date is required')
        return
      }
      if (!basicForm.address) {
        toast.error('Address is required')
        return
      }
      if (!basicForm.functionType) {
        toast.error('Function Type is required')
        return
      }
      if (!basicForm.hall) {
        toast.error('Hall is required')
        return
      }
      if (!basicForm.startTime) {
        toast.error('Start Time is required')
        return
      }
      if (!basicForm.endTime) {
        toast.error('End Time is required')
        return
      }

      const result = await createBooking({
        enquiry: basicForm.enquiryId,
        address: basicForm.address,
        gstNo: basicForm.gstNo,
        bookingDate: selectedDate,
        functionDate: basicForm.functionDate,
        functionType: basicForm.functionType,
        hall: basicForm.hall,
        startTime: basicForm.startTime,
        endTime: basicForm.endTime,
        advance: basicForm.advance,
        paymentMethod: basicForm.paymentMethod,
        status: basicForm.status,
      }).unwrap()

      setBookingId(result._id)
      setCreatedBooking(result)
      toast.success('Booking saved!')
      setMainModalVisible(false)

      if (result.status !== 'Pencil') {
        setShowHallPricingModal(true)
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ── Update Step 1 ────────────────────────────────────────────────
  const handleUpdateBooking = async () => {
    try {
      if (!bookingId) return
      const result = await updateBasic({
        id: bookingId,
        data: {
          address: basicForm.address,
          gstNo: basicForm.gstNo,
          functionType: basicForm.functionType,
          hall: basicForm.hall,
          startTime: basicForm.startTime,
          endTime: basicForm.endTime,
          advance: basicForm.advance,
          paymentMethod: basicForm.paymentMethod,
          status: basicForm.status,
        },
      }).unwrap()

      setCreatedBooking(result)
      toast.success('Booking updated!')
      toggle()

      if (result.status !== 'Pencil') {
        setShowHallPricingModal(true)
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const handleSaveMenu = async () => {
    if (!menuForm.guests || menuForm.guests < 1) {
      toast.error('Please enter number of guests')
      return
    }
    if (!menuForm.guests || menuForm.guests < 1) {
      toast.error('Please enter number of guests')
      return
    }
    if (!basicForm.paymentMethod || basicForm.paymentMethod === '--') {
      toast.error('Please select a payment method')
      return
    }

    try {
      if (!bookingId) {
        toast.error('Please save booking first')
        return
      }

      console.log('menuForm.other before map:', JSON.stringify(menuForm.other)) // ← here

      const isNamedTab = selectedMenu === 'starters' || selectedMenu === 'chatmenu' || selectedMenu === 'customize'

      await updateMenu({
        id: bookingId,
        data: {
          Muhurat: menuForm.Muhurat,
          guests: menuForm.guests,
          seatingArrangement: menuForm.seatingArrangement,
          mealTime: menuForm.mealTime,
          menu: sanitizeIds(menuForm.menu),
          sweets: sanitizeIds(menuForm.sweets),
          additional: sanitizeIds(menuForm.additional),
          externalItems: sanitizeIds(menuForm.externalItems),
          starters: sanitizeIds(selectedStarters),
          chatMenu: sanitizeIds(selectedChatMenu),
          menuType: isNamedTab ? (selectedMenu as 'starters' | 'chatmenu' | 'customize') : 'buffet',
          selectedBuffetId: isNamedTab ? null : selectedMenu,
          other: menuForm.other
            .filter((o: any) => o.id && typeof o.id === 'string')
            .map((o: any) => ({
              id: o.id,
              startTime: o.startTime || '',
              endTime: o.endTime || '',
            })),
        },
      }).unwrap()
      await updateBasic({
        id: bookingId,
        data: {
          advance: basicForm.advance,
          paymentMethod: basicForm.paymentMethod,
        },
      }).unwrap()
      toast.success('Menu saved!')
      // setMenuStep(menuStep + 1)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  // ── Save Step 3 ──────────────────────────────────────────────────
  const handleSavePricing = async () => {
    try {
      if (!bookingId) {
        toast.error('Please save booking first')
        return
      }
      await updateBasic({
        id: bookingId,
        data: {
          advance: basicForm.advance,
          paymentMethod: basicForm.paymentMethod,
        },
      }).unwrap()

      await updatePricing({
        id: bookingId,
        data: {
          totalAmount: pricingForm.totalAmount,
          additionalAmount: pricingForm.additionalAmount,
          specialMenuAmount: pricingForm.specialMenuAmount,
          subtotalamount: pricingForm.subtotalamount,
          gst: pricingForm.gst,
          discount: pricingForm.discount,
          grandTotal: pricingForm.grandTotal,
          finalAmount: pricingForm.finalAmount,
          pendingAmount: pricingForm.pendingAmount,
        },
      }).unwrap()
      toast.success('Pricing saved successfully!')
      toggle()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const handleCreateInvoice = async () => {
    const bookingRefId = bookingId || selectedBookingId
    if (!bookingRefId) {
      toast.error('Booking not found')
      return
    }
    if (invoiceGuests <= 0) {
      toast.error('Please enter number of guests')
      return
    }
    try {
      const result = await createInvoice({
        booking: bookingRefId,
        guests: invoiceGuests,
        baseGuests: existingBooking?.guests || invoiceGuests,
        totalAmount: invoiceCalculated.totalAmount,
        additionalAmount: invoiceCalculated.additionalAmount,
        gst: invoiceCalculated.gst,
        discount: invoiceDiscount,
        advance: invoiceAdvance,
      }).unwrap()

      toast.success('Invoice created successfully')
      toggle() // closes the booking modal
      router.push(`/invoices/invoices-details/${result._id}`)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create invoice')
    }
  }

  const tabs = [
    { id: 'booking' as TabType, icon: '📅', title: isEditable ? 'Update Booking' : 'Add Booking', desc: 'Customer & Event Details' },
    { id: 'menu' as TabType, icon: '🍽️', title: 'Select Menu', desc: 'Choose Buffet & Items' },
    { id: 'pricing' as TabType, icon: '💰', title: 'Payment Information', desc: 'Review Pricing & Amount' },
    { id: 'view' as TabType, icon: '📋', title: 'View Booking', desc: 'Review Booking Summary' },
    { id: 'invoice' as TabType, icon: '🧾', title: 'Create Invoice', desc: 'Generate Invoice for this Booking' },
  ]

  return (
    <>
      <Modal show={open && mainModalVisible} onHide={toggle} size="xl" centered>
        <ModalHeader closeButton>
          <ModalTitle>{isEditable ? '✏️ Edit Booking' : '📅 Add Booking'}</ModalTitle>
        </ModalHeader>

        <ModalBody>
          {isEditable && (
            <Row className="g-3 mb-4">
              {tabs
                .filter((tab) => isEditable || tab.id !== 'pricing')
                .map((tab) => (
                  <Col md={4} key={tab.id}>
                    <div role="button" onClick={() => setActiveTab(tab.id)} className={`booking-tab-card ${activeTab === tab.id ? 'active' : ''}`}>
                      <div className="d-flex align-items-center gap-2">
                        <div className="mb-2" style={{ fontSize: '18px' }}>
                          {tab.icon}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-start">{tab.title}</h6>
                          <small>{tab.desc}</small>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
          )}
          {isEditable && activeTab === null && (
            <div className="text-center text-muted py-5">
              <p className="mb-0">👆 Select a tab above to get started</p>
            </div>
          )}

          {/* ── TAB 1 — original structure ── */}
          {activeTab === 'booking' && (
            <div>
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary-subtle">
                  <h5 className="mb-0">📅 Booking Information</h5>
                </div>
                <div className="card-body">
                  <form>
                    <Row className="g-3">
                      {/* Phone Search */}
                      <Col md={3}>
                        <label className="form-label">📞 Mobile Number</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter 10 digit number"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value)
                              setSearchName('')
                              setEnquiryList([])
                            }}
                          />
                          {enquiryList.length > 0 && phone && (
                            <ul
                              className="list-group position-absolute w-100 shadow z-3"
                              style={{ top: '100%', maxHeight: '200px', overflowY: 'auto' }}>
                              {enquiryList.map((q) => (
                                <li
                                  key={q._id}
                                  className="list-group-item list-group-item-action"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    autofillEnquiry(q)
                                    setEnquiryList([])
                                    setPhone(q.mobileNo)
                                  }}>
                                  {q.customerName} — {q.mobileNo}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </Col>

                      {/* Name Search */}
                      <Col md={3}>
                        <label className="form-label">👤 Customer Name</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name"
                            value={searchName || basicForm.customerName}
                            onChange={(e) => {
                              setSearchName(e.target.value)
                              setPhone('')
                              setEnquiryList([])
                            }}
                          />
                          {enquiryList.length > 0 && searchName && (
                            <ul
                              className="list-group position-absolute w-100 shadow z-3"
                              style={{ top: '100%', maxHeight: '200px', overflowY: 'auto' }}>
                              {enquiryList.map((q) => (
                                <li
                                  key={q._id}
                                  className="list-group-item list-group-item-action"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    autofillEnquiry(q)
                                    setEnquiryList([])
                                    setSearchName('')
                                  }}>
                                  {q.customerName} — {q.mobileNo}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </Col>

                      <Col md={3}>
                        <label className="form-label">📞 Alternate Mobile Number</label>
                        <input type="text" className="form-control" value={basicForm.alternateMobileNo} readOnly />
                      </Col>

                      <Col md={3}>
                        <label className="form-label">📧 Email</label>
                        <input type="email" className="form-control" value={basicForm.email} readOnly />
                      </Col>

                      <Col md={12}>
                        <label className="form-label">🏠 Address</label>
                        <textarea
                          rows={3}
                          className="form-control"
                          placeholder="Enter Address"
                          value={basicForm.address}
                          onChange={(e) => setBasicForm((p) => ({ ...p, address: e.target.value }))}
                        />
                      </Col>

                      <Col md={3}>
                        <label className="form-label">🧾 GST (optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={basicForm.gstNo}
                          onChange={(e) => setBasicForm((p) => ({ ...p, gstNo: e.target.value }))}
                        />
                      </Col>

                      <Col md={3}>
                        <label className="form-label">📅 Booking Date</label>
                        <input type="text" className="form-control" value={isEditable ? bookingDate : selectedDate} disabled />
                      </Col>

                      <Col md={3}>
                        <label className="form-label">🎉 Function Type</label>
                        <select
                          className="form-select"
                          value={basicForm.functionType}
                          onChange={(e) => setBasicForm((p) => ({ ...p, functionType: e.target.value }))}>
                          <option value="">Select Function Type</option>
                          {functionTypes.map((f) => (
                            <option key={f._id} value={f._id}>
                              {f.functionName}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col md={3}>
                        <label className="form-label">📅 Function Date</label>
                        {isEditable ? (
                          <CustomFlatpickr
                            key={basicForm.functionDate} // ← forces remount so the calendar always reflects current state
                            className="form-control"
                            placeholder="Select Function Date"
                            value={basicForm.functionDate}
                            onChange={(_, dateStr) => setBasicForm((p) => ({ ...p, functionDate: dateStr }))}
                            options={{
                              dateFormat: 'Y-m-d',
                              altInput: true,
                              altFormat: 'd M Y',
                            }}
                          />
                        ) : (
                          <input className="form-control" value={basicForm.functionDate} disabled />
                        )}
                      </Col>

                      <Col md={3}>
                        <label className="form-label">🏛️ Hall</label>
                        <select
                          className="form-select"
                          value={basicForm.hall}
                          onChange={(e) => setBasicForm((p) => ({ ...p, hall: e.target.value }))}>
                          <option value="">Select Hall</option>
                          {hallTypes.map((h) => (
                            <option key={h._id} value={h._id}>
                              {h.hallName}
                            </option>
                          ))}
                        </select>
                      </Col>

                      <Col md={3}>
                        <label className="form-label">⏰ Function Start Time</label>
                        <CustomFlatpickr
                          className="form-control"
                          placeholder=""
                          value={basicForm.startTime}
                          onChange={(_, dateStr) => setBasicForm((p) => ({ ...p, startTime: dateStr }))}
                          options={{ enableTime: true, noCalendar: true, dateFormat: 'h:i K', time_24hr: false, minTime: '09:00' }}
                        />
                      </Col>

                      <Col md={3}>
                        <label className="form-label">⏰ Function End Time</label>
                        <CustomFlatpickr
                          className="form-control"
                          placeholder=""
                          value={basicForm.endTime}
                          onChange={(_, dateStr) => setBasicForm((p) => ({ ...p, endTime: dateStr }))}
                          options={{ enableTime: true, noCalendar: true, dateFormat: 'h:i K', time_24hr: false, minTime: '09:00' }}
                        />
                      </Col>

                      {/* <Col md={3}>
                        <label className="form-label">💵 Advance Payment</label>
                        <select
                          className="form-select"
                          value={isAdvance ? 'yes' : 'no'}
                          onChange={(e) => {
                            const val = e.target.value === 'yes'
                            setIsAdvance(val)
                            if (!val) setBasicForm((p) => ({ ...p, advance: 0, paymentMethod: '--' }))
                          }}>
                          <option value="no">❌ No</option>
                          <option value="yes">✅ Yes</option>
                        </select>
                      </Col> */}

                      {/* {isAdvance && (
                        <Col md={3}>
                          <label className="form-label">💵 Advance Amount</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter advance amount"
                            value={basicForm.advance == 0 ? '' : basicForm.advance}
                            onChange={(e) => setBasicForm((p) => ({ ...p, advance: Number(e.target.value) }))}
                          />
                        </Col>
                      )} */}

                      {/* {isAdvance && (
                        <Col md={3}>
                          <label className="form-label">💳 Payment Method</label>
                          <select
                            className="form-select"
                            value={basicForm.paymentMethod}
                            onChange={(e) => setBasicForm((p) => ({ ...p, paymentMethod: e.target.value }))}>
                            <option value="Cash">💵 Cash</option>
                            <option value="UPI">📱 UPI</option>
                            <option value="PhonePe">📲 PhonePe</option>
                            <option value="Google Pay">💳 Google Pay</option>
                            <option value="Paytm">💰 Paytm</option>
                            <option value="Bank Transfer">🏦 Bank Transfer</option>
                            <option value="Cheque">🧾 Cheque</option>
                          </select>
                        </Col>
                      )} */}

                      <Col md={3}>
                        <label className="form-label">📋 Booking Status **</label>
                        <select
                          className="form-select"
                          value={basicForm.status}
                          onChange={(e) => setBasicForm((p) => ({ ...p, status: e.target.value as any }))}>
                          <option value="Confirmed">✅ Confirmed</option>
                          <option value="Pencil">✏️ Pencil</option>
                          <option value="NB">🧾 NB</option>

                          {isEditable && <option value="Cancelled">❌ Cancel</option>}
                        </select>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-5 align-items-center">
                      <div className="d-flex gap-2">
                        <Button variant="light" onClick={toggle}>
                          Cancel
                        </Button>
                        <Button variant="primary" onClick={isEditable ? handleUpdateBooking : handleSaveBooking} disabled={creating}>
                          {isEditable ? '✏️ Update Booking' : creating ? 'Saving...' : '💾 Save Booking'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2 — original structure ── */}
          {activeTab === 'menu' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary-subtle">
                <h5 className="mb-0">🍽️ Select Menu</h5>
              </div>
              <div className="card-body">
                <div className="">
                  {/* Menu Step 1 — Muhurat, Guests, Seating */}
                  {menuStep === 1 && (
                    <form>
                      <Row className="g-3">
                        <Col md={4}>
                          <label className="form-label">📆 Muhurat</label>
                          <CustomFlatpickr
                            className="form-control"
                            placeholder="Select Muhurat Time"
                            value={menuForm.Muhurat}
                            onChange={(_, dateStr) => setMenuForm((p) => ({ ...p, Muhurat: dateStr }))}
                            options={{ enableTime: true, noCalendar: true, dateFormat: 'h:i K', time_24hr: false, minTime: '09:00' }}
                          />
                        </Col>
                        <Col md={4}>
                          <label className="form-label">👪 Meal: Guests</label>
                          <input
                            type="number"
                            className="form-control"
                            value={menuForm.guests == 0 ? '' : menuForm.guests}
                            onChange={(e) => setMenuForm((p) => ({ ...p, guests: Number(e.target.value) }))}
                          />
                        </Col>
                        {/* <Col md={4}>
                          <label className="form-label">🍽️ Seating Arrangement for Meal</label>
                          <select
                            className="form-select"
                            value={menuForm.seatingArrangement}
                            onChange={(e) => setMenuForm((p) => ({ ...p, seatingArrangement: e.target.value }))}>
                            <option value="">🍽️ Select Dining Type</option>
                            <option value="Buffet">🥗 Buffet</option>
                            <option value="Pangat">🍛 Pangat</option>
                          </select>
                        </Col> */}
                        <Col md={4}>
                          <label className="form-label">🕐 Meal Time</label>
                          <CustomFlatpickr
                            className="form-control"
                            placeholder="Select Meal Time"
                            value={menuForm.mealTime}
                            onChange={(_, dateStr) => setMenuForm((p) => ({ ...p, mealTime: dateStr }))}
                            options={{ enableTime: true, noCalendar: true, dateFormat: 'h:i K', time_24hr: false, minTime: '09:00' }}
                          />
                        </Col>
                      </Row>
                    </form>
                  )}

                  {/* Menu Step 2 — Buffet selection only */}
                  {menuStep === 2 && (
                    <div className="row g-3 mt-1 mx-0 mb-4">
                      {[
                        ...buffetList.map((b) => ({ id: b._id, label: b.buffetName, value: b._id })),
                        { id: 'starters', label: '🥗 Starters', value: 'starters' },
                        { id: 'chatmenu', label: '🍜 Chat Menu', value: 'chatmenu' },
                        { id: 'customize', label: '🛠️ Customize Menu', value: 'customize' },
                      ].map((menu) => (
                        <div className="col-md-3 col-sm-6" key={menu.id}>
                          <div
                            role="button"
                            onClick={() => setSelectedMenu(menu.value)}
                            className={`border rounded-3 p-3 h-100 ${selectedMenu === menu.value ? 'bg-primary-subtle border-primary shadow-sm' : 'bg-white'}`}
                            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="menuType"
                                id={menu.id}
                                value={menu.value}
                                checked={selectedMenu === menu.value}
                                onChange={() => setSelectedMenu(menu.value)}
                              />
                              <label
                                className={`form-check-label fw-semibold ${selectedMenu === menu.value ? 'text-primary' : ''}`}
                                htmlFor={menu.id}>
                                {menu.label}
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {menuStep === 3 && (
                    <SpecialMenu
                      step="buffet"
                      menuList={menuList}
                      sweetMenuList={sweetMenuList}
                      otherMenuList={otherMenuList}
                      selectedBuffetId={selectedMenu}
                      buffetList={buffetList}
                      selectedMenu={menuForm.menu}
                      selectedSweets={menuForm.sweets}
                      selectedAdditional={menuForm.additional}
                      onMenuChange={(ids) => setMenuForm((p) => ({ ...p, menu: ids }))}
                      onSweetsChange={(ids) => setMenuForm((p) => ({ ...p, sweets: ids }))}
                      onAdditionalChange={(ids) => setMenuForm((p) => ({ ...p, additional: ids }))}
                      externalItemsList={externalItemsList}
                      selectedExternalItems={menuForm.externalItems}
                      onExternalItemsChange={(ids) => setMenuForm((p) => ({ ...p, externalItems: ids }))}
                      activeCategory={activeBuffetCategory}
                      onCategoryChange={setActiveBuffetCategory}
                      onCategoriesChange={setBuffetCategories}
                      startersMenuList={startersMenuList}
                      chatMenuList={chatMenuList}
                      selectedStarters={selectedStarters}
                      selectedChatMenu={selectedChatMenu}
                      onStartersChange={setSelectedStarters}
                      onChatMenuChange={setSelectedChatMenu}
                    />
                  )}

                  {menuStep === 4 && !isSpecialMenuTab && (
                    <SpecialMenu
                      step="sweets"
                      menuList={menuList}
                      sweetMenuList={sweetMenuList}
                      otherMenuList={otherMenuList}
                      selectedBuffetId={selectedMenu}
                      buffetList={buffetList}
                      selectedMenu={menuForm.menu}
                      selectedSweets={menuForm.sweets}
                      selectedAdditional={menuForm.additional}
                      onMenuChange={(ids) => setMenuForm((p) => ({ ...p, menu: ids }))}
                      onSweetsChange={(ids) => setMenuForm((p) => ({ ...p, sweets: ids }))}
                      onAdditionalChange={(ids) => setMenuForm((p) => ({ ...p, additional: ids }))}
                      externalItemsList={externalItemsList}
                      selectedExternalItems={menuForm.externalItems}
                      onExternalItemsChange={(ids) => setMenuForm((p) => ({ ...p, externalItems: ids }))}
                    />
                  )}

                  {/* Menu Step 5 — Additional Items */}
                  {menuStep === 5 && !isSpecialMenuTab && (
                    <SpecialMenu
                      step="additional"
                      menuList={menuList}
                      sweetMenuList={sweetMenuList}
                      otherMenuList={otherMenuList}
                      selectedBuffetId={selectedMenu}
                      buffetList={buffetList}
                      selectedMenu={menuForm.menu}
                      selectedSweets={menuForm.sweets}
                      selectedAdditional={menuForm.additional}
                      onMenuChange={(ids) => setMenuForm((p) => ({ ...p, menu: ids }))}
                      onSweetsChange={(ids) => setMenuForm((p) => ({ ...p, sweets: ids }))}
                      onAdditionalChange={(ids) => setMenuForm((p) => ({ ...p, additional: ids }))}
                      externalItemsList={externalItemsList}
                      selectedExternalItems={menuForm.externalItems}
                      onExternalItemsChange={(ids) => setMenuForm((p) => ({ ...p, externalItems: ids }))}
                    />
                  )}

                  {/* Menu Step 6 — Other items */}
                  {menuStep === 6 && (
                    <OtherMenu
                      otherList={otherList}
                      selectedOther={menuForm.other}
                      onOtherChange={(items) => setMenuForm((p) => ({ ...p, other: items }))}
                      seatingArrangement={menuForm.seatingArrangement}
                      onSeatingChange={(val) => setMenuForm((p) => ({ ...p, seatingArrangement: val }))}
                    />
                  )}
                  {/* Menu Step 7 — Advance & Payment Method */}
                  {menuStep === 7 && (
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light-subtle">
                        <h5 className="mb-0">💵 Advance &amp; Payment</h5>
                      </div>
                      <div className="card-body">
                        <Row className="g-3">
                          <Col md={6}>
                            <label className="form-label">💵 Advance Amount</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Enter advance amount"
                              value={basicForm.advance === 0 ? '' : basicForm.advance}
                              onChange={(e) => setBasicForm((p) => ({ ...p, advance: Number(e.target.value) }))}
                            />
                          </Col>
                          <Col md={6}>
                            <label className="form-label">💳 Payment Method</label>
                            <select
                              className="form-select"
                              value={basicForm.paymentMethod}
                              onChange={(e) => setBasicForm((p) => ({ ...p, paymentMethod: e.target.value }))}>
                              <option value="--" disabled>
                                Select Payment Method
                              </option>
                              <option value="Cash">💵 Cash</option>
                              <option value="UPI">📱 UPI</option>
                              <option value="PhonePe">📲 PhonePe</option>
                              <option value="Google Pay">💳 Google Pay</option>
                              <option value="Paytm">💰 Paytm</option>
                              <option value="Bank Transfer">🏦 Bank Transfer</option>
                              <option value="Cheque">🧾 Cheque</option>
                              <option value="Card">💳 Debit / Credit Card</option>
                              <option value="Net Banking">🌐 Net Banking</option>
                              <option value="Pending">⏳ Pending</option>
                            </select>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}

                  {/* Menu Step 7 — Pricing */}
                  {menuStep === 8 && (
                    <AmountDetails
                      pricingForm={pricingForm}
                      onPricingChange={(key, val) => setPricingForm((p) => ({ ...p, [key]: val }))}
                      advance={basicForm.advance}
                      onAdvanceChange={(val) => setBasicForm((p) => ({ ...p, advance: val }))}
                      guests={menuForm.guests}
                      sweetMenuList={sweetMenuList}
                      selectedSweets={menuForm.sweets}
                      otherMenuList={otherMenuList}
                      selectedAdditional={menuForm.additional}
                      otherList={otherList}
                      selectedOther={menuForm.other}
                      startersMenuList={startersMenuList}
                      selectedStarters={selectedStarters}
                      chatMenuList={chatMenuList}
                      selectedChatMenu={selectedChatMenu}
                      seatingArrangement={menuForm.seatingArrangement}
                      onCalculatedChange={(values) => setPricingForm((p) => ({ ...p, ...values }))}
                    />
                  )}
                </div>
              </div>

              <div className="card-footer">
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-light"
                    disabled={menuStep === 1}
                    onClick={() => {
                      if (menuStep === 3 && buffetCategories.length > 0) {
                        const currentIndex = buffetCategories.indexOf(activeBuffetCategory)
                        if (currentIndex > 0) {
                          setActiveBuffetCategory(buffetCategories[currentIndex - 1])
                          return
                        }
                      }
                      if (menuStep === 6 && isSpecialMenuTab) {
                        setMenuStep(3)
                        return
                      }
                      setMenuStep((prev) => prev - 1)
                    }}>
                    ⬅ Previous
                  </button>

                  <div className="d-flex gap-2">
                    {menuStep < totalSteps && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={menuStep === 2 && !selectedMenu}
                        onClick={() => {
                          if (menuStep === 3 && buffetCategories.length > 0) {
                            const currentIndex = buffetCategories.indexOf(activeBuffetCategory)
                            if (currentIndex < buffetCategories.length - 1) {
                              setActiveBuffetCategory(buffetCategories[currentIndex + 1])
                              return
                            }
                          }
                          if (menuStep === 3 && isSpecialMenuTab) {
                            setMenuStep(6)
                            return
                          }
                          setMenuStep((prev) => prev + 1)
                        }}>
                        {menuStep === 3 && buffetCategories.indexOf(activeBuffetCategory) < buffetCategories.length - 1
                          ? 'Next Category ➡'
                          : 'Next ➡'}
                      </button>
                    )}

                    {menuStep === 7 && (
                      <button type="button" className="btn btn-success" onClick={handleSaveMenu} disabled={savingMenu}>
                        {savingMenu ? 'Saving...' : '💾 Save Menu'}
                      </button>
                    )}

                    {menuStep === 8 && (
                      <button type="button" className="btn btn-warning" onClick={handleSavePricing} disabled={savingPrice}>
                        {savingPrice ? 'Saving...' : '💰 Save Pricing'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3 — original structure ── */}
          {activeTab === 'view' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-info-subtle">
                <h5 className="mb-0">📋 Booking Summary</h5>
              </div>
              <div className="card-body">
                <MenuSelectionDetails bookingId={bookingId || selectedBookingId || ''} />
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-warning-subtle">
                <h5 className="mb-0">💰 Pricing Details</h5>
              </div>
              <div className="card-body">
                <AmountDetails
                  pricingForm={pricingForm}
                  onPricingChange={(key, val) => setPricingForm((p) => ({ ...p, [key]: val }))}
                  advance={basicForm.advance}
                  onAdvanceChange={(val) => setBasicForm((p) => ({ ...p, advance: val }))}
                  guests={menuForm.guests}
                  sweetMenuList={sweetMenuList}
                  selectedSweets={menuForm.sweets}
                  otherMenuList={otherMenuList}
                  selectedAdditional={menuForm.additional}
                  otherList={otherList}
                  selectedOther={menuForm.other}
                  startersMenuList={startersMenuList}
                  selectedStarters={selectedStarters}
                  chatMenuList={chatMenuList}
                  seatingArrangement={menuForm.seatingArrangement}
                  selectedChatMenu={selectedChatMenu}
                  onCalculatedChange={(values) => setPricingForm((p) => ({ ...p, ...values }))}
                />
              </div>
              <div className="card-footer d-flex justify-content-end">
                <button type="button" className="btn btn-warning" onClick={handleSavePricing} disabled={savingPrice}>
                  {savingPrice ? 'Saving...' : '💰 Save Pricing'}
                </button>
              </div>
            </div>
          )}
          {activeTab === 'invoice' && existingBooking && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-success-subtle">
                <h5 className="mb-0">🧾 Create Invoice</h5>
              </div>
              <div className="card-body">
                <div className="mb-4 p-3 rounded-3" style={{ background: '#fff7ed' }}>
                  <Row>
                    <Col md={4}>
                      <div className="text-muted small">Customer</div>
                      <div className="fw-semibold">{existingBooking.enquiry?.customerName}</div>
                    </Col>
                    <Col md={4}>
                      <div className="text-muted small">Booking No.</div>
                      <div className="fw-semibold">{existingBooking.bookingNo}</div>
                    </Col>
                    <Col md={4}>
                      <div className="text-muted small">Function</div>
                      <div className="fw-semibold">{existingBooking.functionType?.functionName}</div>
                    </Col>
                  </Row>
                </div>

                <InvoiceAmountDetails
                  booking={existingBooking}
                  guests={invoiceGuests}
                  onGuestsChange={setInvoiceGuests}
                  advance={invoiceAdvance}
                  onAdvanceChange={setInvoiceAdvance}
                  discount={invoiceDiscount}
                  onDiscountChange={setInvoiceDiscount}
                  onCalculatedChange={setInvoiceCalculated}
                />
              </div>
              <div className="card-footer d-flex justify-content-end">
                <button type="button" className="btn btn-success" onClick={handleCreateInvoice} disabled={savingInvoice}>
                  {savingInvoice ? 'Creating...' : '🧾 Save & View Invoice'}
                </button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
      {createdBooking && <PricingModal show={showHallPricingModal} onHide={() => setShowHallPricingModal(false)} booking={createdBooking} />}

      <style>{`
        .booking-tab-card {
          background: #fff;
          border: 2px solid #e9ecef;
          border-radius: 18px;
          padding: 13px;
          text-align: center;
          cursor: pointer;
          transition: all .3s ease;
          height: 100%;
        }
        .booking-tab-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,.08); }
        .booking-tab-card.active { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff !important; border-color: transparent; box-shadow: 0 15px 35px rgba(99,102,241,.35); }
        .booking-tab-card.active h6 { color: #fff !important; }
        .booking-tab-card.active small { color: rgba(255,255,255,.85); }
        .menu-stepper { display: flex; justify-content: space-between; margin-bottom: 25px; position: relative; }
        .step-item { flex: 1; text-align: center; position: relative; }
        .step-circle { width: 55px; height: 55px; border-radius: 50%; background: #f8f9fa; border: 2px solid #dee2e6; margin: auto; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .3s; font-size: 22px; }
        .step-circle.active { background: #0d6efd; border-color: #0d6efd; color: #fff; }
        .step-title { display: block; margin-top: 8px; font-size: 13px; color: #6c757d; }
        .step-title.active { color: #0d6efd; font-weight: 600; }
        .step-line { position: absolute; top: 28px; left: 60%; width: 80%; height: 3px; background: #dee2e6; z-index: -1; }
        .step-line.active { background: #0d6efd; }
      `}</style>
    </>
  )
}

export default AddEditEvent

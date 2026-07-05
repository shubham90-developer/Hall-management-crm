'use client'
import { Col } from 'react-bootstrap'
import useCalendar from '../useCalendar'
import AddEditEvent from './AddEditEvent'
import Calendar from './Calendar'

const CalendarPage = () => {
  const { show, isEditable, selectedDate, selectedBookingId, events, onDateClick, onDrop, onEventClick, onEventDrop, onCloseModal } = useCalendar()

  return (
    <>
      <Col xl={12}>
        <Calendar events={events} onDateClick={onDateClick} onDrop={onDrop} onEventClick={onEventClick} onEventDrop={onEventDrop} />
      </Col>

      <AddEditEvent open={show} toggle={onCloseModal} isEditable={isEditable} selectedDate={selectedDate} selectedBookingId={selectedBookingId} />
    </>
  )
}

export default CalendarPage

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { type DateClickArg, type DropArg } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import bootstrapPlugin from '@fullcalendar/bootstrap'

import type { CalendarProps } from '@/types/component-props'
import type { EventClickArg, EventDropArg } from '@fullcalendar/core/index.js'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const Calendar = ({ events, onDateClick, onDrop, onEventClick, onEventDrop }: CalendarProps) => {
  // You can modify these events as per your needs
  const handleDateClick = (arg: DateClickArg) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const clicked = new Date(arg.date)
    clicked.setHours(0, 0, 0, 0)
    if (clicked < today) return
    onDateClick(arg)
  }
  const handleEventClick = (arg: EventClickArg) => {
    const popoverCloseBtn = document.querySelector('.fc-popover-close') as HTMLElement | null
    popoverCloseBtn?.click()

    onEventClick(arg)
  }
  const handleDrop = (arg: DropArg) => {
    onDrop(arg)
  }
  const handleEventDrop = (arg: EventDropArg) => {
    onEventDrop(arg)
  }

  return (
    <>
      <style>{`
  .fc-day-past-disabled {
    background-color: #f5f5f5 !important;
    cursor: not-allowed !important;
    opacity: 0.6;
  }

  .fc .fc-daygrid-more-link {
    font-size: 20px !important;
    font-weight: 600 !important;
  }
  .fc .fc-daygrid-day-number {
      font-size: 18px !important;
      width: 36px !important;
      height: 36px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 50% !important;
    }

    /* Fix: FullCalendar's "+more" popover was floating above the Bootstrap modal */
    .fc-popover {
      z-index: 1040 !important;
    }
  `}</style>
      <div className="mt-4 mt-lg-0">
        <div id="calendar">
          <FullCalendar
            initialView="dayGridMonth"
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, bootstrapPlugin]}
            themeSystem="bootstrap"
            bootstrapFontAwesome={false}
            handleWindowResize={true}
            slotDuration="00:15:00"
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
              list: 'List',
              prev: 'Prev',
              next: 'Next',
            }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
              // right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            }}
            // height={height - 200}
            dayMaxEventRows={1}
            editable={true}
            selectable={true}
            droppable={true}
            events={events}
            dateClick={handleDateClick}
            dayCellClassNames={(arg) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const cellDate = new Date(arg.date)
              cellDate.setHours(0, 0, 0, 0)
              return cellDate < today ? ['fc-day-past-disabled'] : []
            }}
            eventClick={handleEventClick}
            drop={handleDrop}
            eventDrop={handleEventDrop}
          />
        </div>
      </div>

      <style>
        {`
        /* globals.css */

.fc .fc-day-today {
  background-color: #0d346b !important;
}

.fc .fc-day-today .fc-daygrid-day-number {
  background: #fff;
  color: #000 !important;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}`}
      </style>
    </>
  )
}

export default Calendar

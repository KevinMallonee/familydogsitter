'use client';

import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Booking } from '@/types';
import { supabase } from '@/lib/supabase';

interface BookingCalendarProps {
  bookings?: Booking[];
}

export default function BookingCalendar({ bookings: propBookings }: BookingCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [bookings, setBookings] = useState<Booking[]>(propBookings || []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!propBookings) {
        try {
          const { data, error } = await supabase
            .from('bookings')
            .select(`
              *,
              service:services(*)
            `)
            .neq('status', 'cancelled');

          if (error) {
            console.error('Error fetching bookings:', error);
          } else {
            setBookings(data || []);
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      }
    };

    fetchBookings();
  }, [propBookings]);

  const events = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.service?.name || 'Service'} - ${booking.status}`,
    start: booking.start_time,
    end: booking.end_time,
    backgroundColor: booking.status === 'confirmed' ? '#10B981' : 
                   booking.status === 'pending' ? '#F59E0B' : '#EF4444',
    borderColor: booking.status === 'confirmed' ? '#059669' : 
                 booking.status === 'pending' ? '#D97706' : '#DC2626',
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        events={events}
        height="auto"
        eventClick={(info) => {
          console.log('Event clicked:', info.event);
        }}
        selectable={true}
        select={(info) => {
          console.log('Date selected:', info.start, info.end);
        }}
        editable={false}
        dayMaxEvents={true}
        weekends={true}
        locale="en"
      />
    </div>
  );
} 
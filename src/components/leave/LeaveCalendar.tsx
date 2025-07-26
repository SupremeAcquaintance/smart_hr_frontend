// src/components/leave/LeaveCalendar.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { leaveService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../styles/LeaveCalendar.css';

const localizer = momentLocalizer(moment);

interface LeaveCalendarEntry {
  id: number;
  start_date: string;
  end_date: string;
  type: string;
  status: 'approved' | 'pending' | 'rejected';
  employee_name: string;
  employee_id: number;
}

interface LeaveEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

interface LeaveData {
  id: string;
  employee: {
    name: string;
  };
  type: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending' | 'rejected';
}

const LeaveCalendar: React.FC = () => {
  const [events, setEvents] = useState<LeaveEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchLeaveData = async () => {
      setIsLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      try {
        const response = await leaveService.getLeaveCalendar({ month, year });
        const formattedEvents = response.map((leave: LeaveCalendarEntry) => ({
          id: String(leave.id),
          title: `${leave.employee_name} - ${leave.type}`,
          start: new Date(leave.start_date),
          end: new Date(leave.end_date),
          allDay: true,
          status: leave.status,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to fetch leave calendar', error);
        addNotification({
          type: 'error',
          message: 'Failed to load leave calendar data',
          priority: 'medium',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveData();
  }, [currentDate, addNotification]);

  const eventStyleGetter = (event: LeaveEvent) => {
    const backgroundColor = {
      approved: '#48c78e',
      pending: '#f9ca24',
      rejected: '#ff6b6b',
    }[event.status];

    return {
      style: {
        backgroundColor,
        color: '#fff',
        borderRadius: '12px',
        padding: '4px 6px',
        border: 'none',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        opacity: 0.9,
      },
    };
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="leave-calendar-container">
      <div className="calendar-card">
        <div className="calendar-header">
          <button
            onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month').toDate())}
            disabled={isLoading}
          >
            &larr; Previous
          </button>
          <h2 className="review-heading">{moment(currentDate).format('MMMM YYYY')}</h2>
          <button
            onClick={() => setCurrentDate(moment(currentDate).add(1, 'month').toDate())}
            disabled={isLoading}
          >
            Next &rarr;
          </button>
        </div>

        {isLoading ? (
          <div className="loading-indicator">🔄 Loading leave calendar...</div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600, backgroundColor: 'transparent' }}
            eventPropGetter={eventStyleGetter}
            onNavigate={handleNavigate}
            defaultDate={currentDate}
            views={['month', 'week', 'day']}
            onSelectEvent={(event) => {
              console.log('Selected leave event:', event);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LeaveCalendar;
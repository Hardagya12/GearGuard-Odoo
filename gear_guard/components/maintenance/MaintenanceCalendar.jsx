
'use client';

import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function MaintenanceCalendar({ requests }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function nextMonth() {
    setCurrentDate(addMonths(currentDate, 1));
  }

  function prevMonth() {
    setCurrentDate(subMonths(currentDate, 1));
  }

  function getRequestsForDay(day) {
    return requests.filter(req => 
      req.scheduledDate && isSameDay(new Date(req.scheduledDate), day)
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand" />
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex rounded-md shadow-sm">
            <button onClick={prevMonth} className="p-1.5 border border-r-0 border-gray-300 rounded-l-md hover:bg-gray-50 text-gray-500">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="p-1.5 border border-gray-300 rounded-r-md hover:bg-gray-50 text-gray-500">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
           <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span> Preventive
           <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></span> Corrective
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {weekDays.map(day => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {days.map(day => {
            const dayRequests = getRequestsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "min-h-[100px] border-b border-r border-gray-100 p-2 transition-colors hover:bg-gray-50 relative group",
                  !isCurrentMonth && "bg-gray-50/50 text-gray-400"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday ? "bg-brand text-white" : "text-gray-700"
                  )}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* Plus icon on hover to add request for this date */}
                  {/* Future Implementation: Add Click to Schedule */}
                </div>

                <div className="mt-1 space-y-1">
                  {dayRequests.map(req => (
                    <div 
                      key={req.id} 
                      className={cn(
                        "text-xs px-2 py-1 rounded border shadow-sm truncate cursor-pointer hover:opacity-80",
                        req.type === 'PREVENTIVE' 
                          ? "bg-blue-50 text-blue-700 border-blue-100" 
                          : "bg-red-50 text-red-700 border-red-100"
                      )}
                      title={`${req.subject} (${req.equipment?.name})`}
                    >
                      <div className="font-medium truncate">{req.equipment?.name}</div>
                      <div className="truncate text-[10px] opacity-75">{req.subject}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

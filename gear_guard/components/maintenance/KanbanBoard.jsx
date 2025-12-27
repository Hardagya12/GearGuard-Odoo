
'use client';

import { useState } from 'react';
import { updateRequestStage } from '@/server/actions/requests';
import { Wrench, Clock, CheckCircle, Trash2, Calendar, AlertTriangle, Timer } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { LogTimeModal } from '@/components/maintenance/LogTimeModal';

const STAGES = [
  { id: 'NEW', label: 'New', icon: Clock, color: 'bg-purple-50 border-purple-200' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: Wrench, color: 'bg-blue-50 border-blue-200' },
  { id: 'REPAIRED', label: 'Repaired', icon: CheckCircle, color: 'bg-green-50 border-green-200' },
  { id: 'SCRAP', label: 'Scrap', icon: Trash2, color: 'bg-red-50 border-red-200' },
];

export function KanbanBoard({ initialRequests }) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequestForLog, setSelectedRequestForLog] = useState(null);

  const handleStageChange = async (requestId, newStage) => {
    // If moving to REPAIRED, maybe trigger Log Time automatically?
    // For now, let's keep it separate as requested, but we can do both.
    
    // Optimistic update
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, stage: newStage } : r));
    
    const result = await updateRequestStage(requestId, newStage);
    if (!result.success) {
      // Revert on failure
      setRequests(initialRequests);
    }
  };

  const groupedRequests = STAGES.reduce((acc, stage) => {
    acc[stage.id] = requests.filter(r => r.stage === stage.id);
    return acc;
  }, {});

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {STAGES.map((stage) => (
          <div key={stage.id} className="flex flex-col">
            {/* Column Header */}
            <div className={`${stage.color} border-2 rounded-t-lg px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <stage.icon className="w-4 h-4 text-gray-700" />
                <h3 className="font-semibold text-sm text-gray-800">{stage.label}</h3>
              </div>
              <span className="bg-white text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                {groupedRequests[stage.id]?.length || 0}
              </span>
            </div>

            {/* Cards Container */}
            <div className="bg-gray-50 border-x-2 border-b-2 border-gray-200 rounded-b-lg p-3 space-y-3 min-h-[500px]">
              {groupedRequests[stage.id]?.map((request) => (
                <RequestCard 
                  key={request.id} 
                  request={request} 
                  onStageChange={handleStageChange}
                  onLogTime={() => setSelectedRequestForLog(request)}
                  stages={STAGES}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedRequestForLog && (
        <LogTimeModal 
          request={selectedRequestForLog} 
          onClose={() => {
              setSelectedRequestForLog(null);
              // Optimistically update duration in specific card? 
              // The page will revalidate anyway from server action, but for smooth UI we could update state.
              // For simplicity in this chunk, relying on server revalidation (Action calls revalidatePath).
          }} 
        />
      )}
    </>
  );
}

function RequestCard({ request, onStageChange, onLogTime, stages }) {
  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-600',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-orange-100 text-orange-700',
    CRITICAL: 'bg-red-100 text-red-700',
  };

  const isOverdue = request.scheduledDate 
    && isPast(new Date(request.scheduledDate)) 
    && !isToday(new Date(request.scheduledDate))
    && request.stage !== 'REPAIRED' 
    && request.stage !== 'SCRAP';

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group relative ${isOverdue ? 'border-l-4 border-l-red-500' : 'border-gray-200'}`}>
      
      {/* Overdue Badge */}
      {isOverdue && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3" />
              OVERDUE
          </div>
      )}

      {/* Request Title */}
      <h4 className="font-semibold text-sm text-gray-900 mb-2 truncate pr-16" title={request.subject}>{request.subject}</h4>
      
      {/* Equipment Info */}
      <div className="text-xs text-gray-500 mb-3">
        <span className="font-medium text-brand">
          {request.equipment?.name || 'Unknown Equipment'}
        </span>
      </div>

      {/* Dates & Duration */}
      <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 mb-3">
         {request.scheduledDate && (
             <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : ''}`}>
                 <Calendar className="w-3 h-3" />
                 {format(new Date(request.scheduledDate), 'MMM d')}
             </div>
         )}
         
         {/* Duration Display / Button */}
         <div 
            onClick={onLogTime}
            className={`flex items-center gap-1 font-medium cursor-pointer hover:underline ${request.durationHours > 0 ? 'text-blue-600' : 'text-gray-400'}`}
            title="Click to log time"
         >
             {request.durationHours > 0 ? (
                <>
                  <Clock className="w-3 h-3" />
                  {request.durationHours}h
                </>
             ) : (
                <>
                  <Timer className="w-3 h-3" />
                  Log Time
                </>
             )}
         </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded-full font-medium ${priorityColors[request.priority] || priorityColors.MEDIUM}`}>
          {request.priority}
        </span>
        
        {request.technician && (
          <span className="text-gray-500" title={request.technician.email}>
              {request.technician.name}
          </span>
        )}
      </div>

      {/* Quick Stage Selector (appears on hover) */}
      <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <select 
          value={request.stage}
          onChange={(e) => onStageChange(request.id, e.target.value)}
          className="w-full text-xs px-2 py-1 border border-gray-200 rounded focus:border-brand focus:ring-1 focus:ring-brand outline-none"
        >
          {stages.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

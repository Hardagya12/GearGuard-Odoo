
'use client';

import { useState } from 'react';
import { updateRequestDuration } from '@/server/actions/requests';
import { X, Clock, Loader2 } from 'lucide-react';

export function LogTimeModal({ request, onClose }) {
  const [duration, setDuration] = useState(request.durationHours || 0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    await updateRequestDuration(request.id, duration);
    
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand" />
            Log Time Spent
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-1 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours (h)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand focus:border-brand sm:text-sm outline-none transition"
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter total time spent on "{request.subject}"
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-dark transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3 h-3 animate-spin" />}
              Save Duration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

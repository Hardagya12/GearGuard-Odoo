
'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Loader2, Calendar } from 'lucide-react';
import { createRequest } from '@/server/actions/requests';

export function CreateRequestButton({ equipment, teams }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [autoFilledTeam, setAutoFilledTeam] = useState('');

  // Auto-fill team when equipment is selected
  useEffect(() => {
    if (selectedEquipment && equipment) {
      const selectedEq = equipment.find(e => e.id === selectedEquipment);
      if (selectedEq?.maintenanceTeamId) {
        setAutoFilledTeam(selectedEq.maintenanceTeamId);
      }
    }
  }, [selectedEquipment, equipment]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = {
      subject: formData.get('subject'),
      description: formData.get('description'),
      type: formData.get('type'),
      priority: formData.get('priority'),
      equipmentId: formData.get('equipmentId'),
      teamId: autoFilledTeam || formData.get('teamId'),
      scheduledDate: formData.get('scheduledDate') || null,
    };

    const result = await createRequest(data);
    setLoading(false);

    if (result.success) {
      setIsOpen(false);
      e.target.reset();
      setSelectedEquipment('');
      setAutoFilledTeam('');
    } else {
      setError(result.error || 'Failed to create request');
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-dark transition flex items-center gap-2 shadow-md shadow-brand/20"
      >
        <Plus className="w-4 h-4" />
        New Request
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand to-brand-dark px-6 py-4 flex justify-between items-center text-white">
                <h3 className="text-lg font-semibold">New Maintenance Request</h3>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {/* Subject */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                        <input 
                            name="subject" 
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition" 
                            placeholder="e.g. Leaking Oil" 
                        />
                    </div>

                    {/* Equipment (triggers auto-fill) */}
                    <div className="col-span-2">
                         <label className="block text-sm font-medium text-gray-700 mb-1">Equipment *</label>
                         <select 
                            name="equipmentId" 
                            required 
                            value={selectedEquipment}
                            onChange={(e) => setSelectedEquipment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition"
                        >
                             <option value="">Select equipment...</option>
                             {equipment?.map(eq => (
                                 <option key={eq.id} value={eq.id}>{eq.name} ({eq.serialNumber})</option>
                             ))}
                         </select>
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                        <select name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition">
                            <option value="CORRECTIVE">Corrective (Breakdown)</option>
                            <option value="PREVENTIVE">Preventive (Routine)</option>
                        </select>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select name="priority" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition">
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>

                    {/* Team (Auto-filled) */}
                    <div className="col-span-2">
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maintenance Team {autoFilledTeam && <span className="text-brand text-xs">(Auto-filled)</span>}
                         </label>
                         <select 
                            name="teamId" 
                            value={autoFilledTeam}
                            onChange={(e) => setAutoFilledTeam(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition bg-purple-50"
                        >
                             <option value="">Select team...</option>
                             {teams?.map(team => (
                                 <option key={team.id} value={team.id}>{team.name}</option>
                             ))}
                         </select>
                    </div>

                    {/* Scheduled Date (for Preventive) */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Scheduled Date (Optional)
                        </label>
                        <input 
                            type="date" 
                            name="scheduledDate"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition"
                        />
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            name="description"
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition resize-none"
                            placeholder="Describe the issue or maintenance task..."
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end gap-3 border-t">
                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="bg-brand text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-brand-dark transition shadow-md disabled:opacity-50 flex items-center gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Create Request
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

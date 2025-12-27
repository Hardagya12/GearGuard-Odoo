
'use client';

import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { createEquipment } from '@/server/actions/equipment';

export function EquipmentActions({ teams }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      serialNumber: formData.get('serialNumber'),
      department: formData.get('department'),
      maintenanceTeamId: formData.get('maintenanceTeamId'),
      location: formData.get('location'),
    };

    const result = await createEquipment(data);
    setLoading(false);

    if (result.success) {
      setIsOpen(false);
      // Optional: Toast success
    } else {
      setError(result.error || 'Failed to create equipment');
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition flex items-center gap-2 shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Create
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">New Equipment</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
                        <input name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition" placeholder="e.g. CNC Machine X1" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                        <input name="serialNumber" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition" placeholder="SN-12345" />
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                         <select name="department" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition">
                             <option value="Production">Production</option>
                             <option value="Logistics">Logistics</option>
                             <option value="Maintenance">Maintenance</option>
                             <option value="IT">IT</option>
                         </select>
                    </div>

                    <div className="col-span-2">
                         <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Team</label>
                         <select name="maintenanceTeamId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition">
                             <option value="">Select a team...</option>
                             {teams?.map(team => (
                                 <option key={team.id} value={team.id}>{team.name}</option>
                             ))}
                         </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input name="location" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition" placeholder="e.g. Floor 1" />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="bg-brand text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-brand-dark transition shadow-md disabled:opacity-50 flex items-center gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Equipment
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

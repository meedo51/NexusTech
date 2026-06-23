import React from 'react';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const dayLabels: Record<string, string> = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };

interface Props {
  businessHours: any;
  isEditing: boolean;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const BusinessHoursEditor: React.FC<Props> = ({ businessHours, isEditing, onSave, isSaving }) => {
  const [form, setForm] = React.useState({ days: '', hours: '', is24Hours: false, timezone: 'UTC', schedule: {} as any });

  React.useEffect(() => {
    if (businessHours) {
      setForm({
        days: businessHours.days || 'Monday - Friday',
        hours: businessHours.hours || '9:00 AM - 6:00 PM',
        is24Hours: businessHours.is24Hours || false,
        timezone: businessHours.timezone || 'UTC',
        schedule: days.reduce((acc, d) => {
          const s = businessHours.schedule?.[d];
          acc[d] = { open: s?.open || '09:00', close: s?.close || '18:00', isClosed: s?.isClosed ?? (d === 'sunday') };
          return acc;
        }, {} as any)
      });
    }
  }, [businessHours]);

  const updateDay = (day: string, field: string, value: any) => {
    setForm({ ...form, schedule: { ...form.schedule, [day]: { ...form.schedule[day], [field]: value } } });
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ businessHours: form }); };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-white">Business Hours</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Days Label</label>
          <input type="text" value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Hours Label</label>
          <input type="text" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Timezone</label>
          <input type="text" value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="is24Hours" checked={form.is24Hours} onChange={e => setForm({ ...form, is24Hours: e.target.checked })} disabled={!isEditing}
          className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500" />
        <label htmlFor="is24Hours" className="text-sm text-gray-300">Open 24 hours</label>
      </div>

      <div className="space-y-2">
        {days.map(day => (
          <div key={day} className={`flex items-center gap-3 p-3 rounded-xl ${form.schedule[day]?.isClosed ? 'bg-red-900/10' : 'bg-gray-700/30'}`}>
            <span className="w-24 text-sm font-medium text-gray-300">{dayLabels[day]}</span>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" checked={form.schedule[day]?.isClosed || false}
                onChange={e => updateDay(day, 'isClosed', e.target.checked)} disabled={!isEditing}
                className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500" />
              Closed
            </label>
            {!form.schedule[day]?.isClosed && (
              <>
                <input type="time" value={form.schedule[day]?.open || '09:00'} onChange={e => updateDay(day, 'open', e.target.value)} disabled={!isEditing}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <span className="text-gray-500">to</span>
                <input type="time" value={form.schedule[day]?.close || '18:00'} onChange={e => updateDay(day, 'close', e.target.value)} disabled={!isEditing}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </>
            )}
          </div>
        ))}
      </div>

      {isEditing && <div className="flex justify-end pt-2"><button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button></div>}
    </form>
  );
};

export default BusinessHoursEditor;

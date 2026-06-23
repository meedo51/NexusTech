import React from 'react';

interface Props {
  contact: any;
  isEditing: boolean;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const ContactInfoEditor: React.FC<Props> = ({ contact, isEditing, onSave, isSaving }) => {
  const [form, setForm] = React.useState({ email: '', phone: '', phoneSecondary: '' });
  React.useEffect(() => {
    if (contact) setForm({ email: contact.email || '', phone: contact.phone || '', phoneSecondary: contact.phoneSecondary || '' });
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-white">Primary Contact Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
          <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Secondary Phone</label>
          <input type="text" value={form.phoneSecondary} onChange={e => setForm({ ...form, phoneSecondary: e.target.value })}
            disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>
      {isEditing && <div className="flex justify-end pt-2"><button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button></div>}
    </form>
  );
};

export default ContactInfoEditor;

import React from 'react';

interface Props {
  formSettings: any;
  isEditing: boolean;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const ContactFormSettings: React.FC<Props> = ({ formSettings, isEditing, onSave, isSaving }) => {
  const [form, setForm] = React.useState({ enabled: true, emailSubject: '', successMessage: '', errorMessage: '', notificationEmails: '' });

  React.useEffect(() => {
    if (formSettings) setForm({
      enabled: formSettings.enabled ?? true,
      emailSubject: formSettings.emailSubject || '',
      successMessage: formSettings.successMessage || '',
      errorMessage: formSettings.errorMessage || '',
      notificationEmails: formSettings.notificationEmails?.join(', ') || ''
    });
  }, [formSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      contactForm: {
        ...form,
        notificationEmails: form.notificationEmails.split(',').map(s => s.trim()).filter(Boolean)
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-white">Contact Form Settings</h3>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} disabled={!isEditing}
          className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500" />
        <span className="text-sm text-gray-300">Enable contact form</span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Subject</label>
          <input type="text" value={form.emailSubject} onChange={e => setForm({ ...form, emailSubject: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Notification Emails (comma-separated)</label>
          <input type="text" value={form.notificationEmails} onChange={e => setForm({ ...form, notificationEmails: e.target.value })} disabled={!isEditing}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Success Message</label>
        <textarea value={form.successMessage} onChange={e => setForm({ ...form, successMessage: e.target.value })} rows={2} disabled={!isEditing}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Error Message</label>
        <textarea value={form.errorMessage} onChange={e => setForm({ ...form, errorMessage: e.target.value })} rows={2} disabled={!isEditing}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>

      {isEditing && <div className="flex justify-end pt-2"><button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button></div>}
    </form>
  );
};

export default ContactFormSettings;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Globe, MapPin, Clock, MessageSquare, Map, AlertCircle, Home, User, Shield, Edit3, Save } from 'lucide-react';
import { useContact } from '../../../hooks/useContact';
import ContactInfoEditor from './ContactInfoEditor';
import AddressEditor from './AddressEditor';
import SocialMediaManager from './SocialMediaManager';
import BusinessHoursEditor from './BusinessHoursEditor';
import ContactFormSettings from './ContactFormSettings';
import LocationManager from './LocationManager';
import EmergencyContactEditor from './EmergencyContactEditor';
import ContactPreview from './ContactPreview';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'contact', label: 'Contact Info', icon: User },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'social', label: 'Social Media', icon: Globe },
  { id: 'hours', label: 'Business Hours', icon: Clock },
  { id: 'form', label: 'Contact Form', icon: MessageSquare },
  { id: 'location', label: 'Location', icon: Map },
  { id: 'emergency', label: 'Emergency', icon: AlertCircle },
];

const ContactDashboard: React.FC = () => {
  const { contact, loading, error, refreshContact, updateContact, addSocialMedia, updateSocialMedia, deleteSocialMedia, reorderSocialMedia } = useContact();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try { await updateContact(data); setIsEditing(false); } catch {}
    setIsSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" /></div>;

  if (error) return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <p className="text-red-400">Failed to load contact data</p>
      <button onClick={() => refreshContact()} className="mt-4 px-4 py-2 bg-gray-700 rounded-xl text-white text-sm">Retry</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Contact Management</h1>
          <p className="text-gray-400 mt-1">Manage all contact information across your website</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm ${contact?.isActive ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
            {contact?.isActive ? 'Active' : 'Inactive'}
          </span>
          <button onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:opacity-90">
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? 'Save All' : 'Edit All'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Mail, label: 'Primary Email', value: contact?.email || 'Not set', color: 'from-purple-500 to-purple-600' },
          { icon: Phone, label: 'Phone', value: contact?.phone || 'Not set', color: 'from-blue-500 to-blue-600' },
          { icon: Globe, label: 'Social Platforms', value: contact?.socialMedia?.filter((s: any) => s.isActive).length || 0, color: 'from-pink-500 to-pink-600' },
          { icon: MapPin, label: 'Location', value: contact?.address?.city || 'Not set', color: 'from-green-500 to-green-600' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold text-white mt-1 truncate max-w-[140px]">{stat.value}</p>
              </div>
              <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <ContactPreview contact={contact} />}
      {activeTab === 'contact' && <ContactInfoEditor contact={contact} isEditing={isEditing} onSave={handleSave} isSaving={isSaving} />}
      {activeTab === 'address' && <AddressEditor address={contact?.address} isEditing={isEditing} onSave={handleSave} isSaving={isSaving} />}
      {activeTab === 'social' && <SocialMediaManager
        socialMedia={contact?.socialMedia || []}
        onAdd={addSocialMedia}
        onUpdate={(platform, data) => updateSocialMedia({ platform, data })}
        onDelete={deleteSocialMedia}
        onReorder={reorderSocialMedia}
      />}
      {activeTab === 'hours' && <BusinessHoursEditor businessHours={contact?.businessHours} isEditing={isEditing} onSave={handleSave} isSaving={isSaving} />}
      {activeTab === 'form' && <ContactFormSettings formSettings={contact?.contactForm} isEditing={isEditing} onSave={handleSave} isSaving={isSaving} />}
      {activeTab === 'location' && <LocationManager location={contact?.location} isEditing={isEditing} onSave={handleSave} isSaving={isSaving} />}
      {activeTab === 'emergency' && <EmergencyContactEditor emergencyContact={contact?.emergencyContact} isEditing={isEditing} onSave={handleSave} isSaving={isSaving} />}
    </motion.div>
  );
};

export default ContactDashboard;

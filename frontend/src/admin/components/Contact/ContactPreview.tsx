import React from 'react';
import { Mail, Phone, MapPin, Clock, Globe, Github, Linkedin, Twitter, Link } from 'lucide-react';

interface Props { contact: any; }

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Link };

const ContactPreview: React.FC<Props> = ({ contact }) => {
  if (!contact) return <div className="bg-gray-800/50 rounded-xl p-6 text-center text-gray-400 border border-gray-700/50">No contact data available</div>;

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-1">Live Preview</h3>
      <p className="text-sm text-gray-400 mb-6">How your contact section appears on the frontend</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5 text-purple-400" /></div>
            <div><p className="text-sm text-gray-400">Email</p><p className="text-white">{contact.email || 'Not set'}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center"><Phone className="w-5 h-5 text-blue-400" /></div>
            <div><p className="text-sm text-gray-400">Phone</p><p className="text-white">{contact.phone || 'Not set'}</p>{contact.phoneSecondary && <p className="text-sm text-gray-400">{contact.phoneSecondary}</p>}</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center mt-1"><MapPin className="w-5 h-5 text-green-400" /></div>
            <div><p className="text-sm text-gray-400">Address</p><p className="text-white">{contact.address?.street || 'Not set'}</p><p className="text-gray-300">{contact.address?.city}{contact.address?.city && ', '}{contact.address?.state || ''} {contact.address?.zipCode || ''}</p><p className="text-gray-300">{contact.address?.country}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-600/20 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-400" /></div>
            <div><p className="text-sm text-gray-400">Business Hours</p><p className="text-white">{contact.businessHours?.days || 'Not set'}</p><p className="text-gray-300">{contact.businessHours?.hours || ''}</p></div>
          </div>
        </div>

        <div className="space-y-6">
          <div><p className="text-sm font-medium text-gray-400 mb-3">Connect With Us</p>
            <div className="flex flex-wrap gap-3">
              {contact.socialMedia?.filter((s: any) => s.isActive).map((s: any) => {
                const Icon = socialIcons[s.platform] || Link;
                return <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-purple-600/20 transition-colors group">
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>;
              })}
              {(!contact.socialMedia || contact.socialMedia.length === 0) && <p className="text-gray-500 text-sm">No social media added</p>}
            </div>
          </div>

          {contact.location?.mapEmbedUrl && <div><p className="text-sm font-medium text-gray-400 mb-3">Location</p><div className="rounded-xl h-48 overflow-hidden bg-gray-700/30"><iframe src={contact.location.mapEmbedUrl} className="w-full h-full" title="Map" style={{ border: 0 }} allowFullScreen loading="lazy" /></div></div>}

          {contact.emergencyContact?.name && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-sm font-medium text-red-400">Emergency Contact</p>
              <p className="text-white text-sm">{contact.emergencyContact.name}{contact.emergencyContact.relationship ? ` - ${contact.emergencyContact.relationship}` : ''}</p>
              <p className="text-gray-300 text-sm">{contact.emergencyContact.phone}{contact.emergencyContact.email ? ` | ${contact.emergencyContact.email}` : ''}</p>
            </div>
          )}

          {contact.contactForm?.enabled && (
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-sm font-medium text-gray-400 mb-3">Contact Form Preview</p>
              <div className="bg-gray-700/30 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Your name" disabled className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-sm" />
                  <input type="email" placeholder="your@email.com" disabled className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-sm" />
                </div>
                <textarea placeholder="Your message..." disabled rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-sm" />
                <button disabled className="px-6 py-2.5 bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white rounded-xl text-sm cursor-not-allowed">Send Message</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPreview;

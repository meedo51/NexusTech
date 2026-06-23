import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Globe, Send,
  Github, Linkedin, Twitter, Youtube,
  CheckCircle, AlertCircle, RefreshCw,
  ChevronRight, Sparkles, Heart, Shield
} from 'lucide-react';
import { useContact } from '../../hooks/useContact';

const socialIcons: Record<string, any> = {
  github: Github, linkedin: Linkedin, twitter: Twitter,
  facebook: Globe, instagram: Globe, youtube: Youtube,
  discord: Globe, website: Globe, email: Mail
};

const platformColors: Record<string, string> = {
  github: '#6e5494', linkedin: '#0a66c2', twitter: '#1da1f2',
  facebook: '#1877f2', instagram: '#e4405f', youtube: '#ff0000',
  discord: '#5865f2', website: '#6C63FF', email: '#d44637'
};

const ContactSection: React.FC = () => {
  const { contact, loading: isLoading, error, refreshContact, isFetching } = useContact({ public: true });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshContact();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [refreshContact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  if (isLoading) return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500" />
          <p className="text-gray-400">Loading contact information...</p>
        </div>
      </div>
    </section>
  );

  if (error || !contact?.isActive) {
    const msg = error ? 'Failed to load contact information' : 'Contact section is currently inactive';
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-3xl p-12 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">{msg}</h3>
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="inline-block mt-6 px-6 py-3 bg-purple-600/20 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-colors">
                <Mail className="w-4 h-4 inline mr-2" />{contact.email}
              </a>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-600/5 via-pink-600/5 to-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-600/10 px-4 py-2 rounded-full border border-purple-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" /><span className="text-purple-400 text-sm font-medium">Get in Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Let's Build Something
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Amazing Together</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Have a project in mind or want to collaborate? I'm always open to new opportunities and creative ideas.</p>
          <div className="flex items-center justify-center mt-4 gap-2 text-xs text-gray-500">
            <span>Updated: {contact.lastUpdated ? new Date(contact.lastUpdated).toLocaleString() : 'Just now'}</span>
            <button onClick={() => refreshContact()} className="text-gray-400 hover:text-white transition-colors" disabled={isFetching}>
              <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3 space-y-6">
            {/* Status Card */}
            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${contact.businessHours?.isOpenNow ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-white font-medium">{contact.businessHours?.isOpenNow ? 'Currently Available' : 'Currently Offline'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" /><span>{contact.businessHours?.timezone || 'UTC'}</span>
                </div>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contact.email && (
                <motion.a whileHover={{ scale: 1.02, y: -2 }} href={`mailto:${contact.email}`}
                  className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-purple-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">{contact.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </motion.a>
              )}
              {contact.phone && (
                <motion.a whileHover={{ scale: 1.02, y: -2 }} href={`tel:${contact.phone}`}
                  className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-blue-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{contact.phone}</p>
                      {contact.phoneSecondary && <p className="text-xs text-gray-500 mt-1">{contact.phoneSecondary}</p>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </motion.a>
              )}
              {contact.address?.city && (
                <motion.div whileHover={{ scale: 1.02, y: -2 }}
                  className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 sm:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600/20 to-green-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Address</p>
                      <p className="text-white font-medium">
                        {contact.address.street && <span>{contact.address.street}<br /></span>}
                        {contact.address.city}{contact.address.state ? `, ${contact.address.state}` : ''} {contact.address.zipCode || ''}
                        {contact.address.country && <><br />{contact.address.country}</>}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Business Hours */}
            {contact.businessHours?.days && (
              <motion.div whileHover={{ scale: 1.01 }} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-600/20 to-yellow-600/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Business Hours</p>
                    <p className="text-sm text-gray-400">{contact.businessHours.days}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {contact.businessHours.is24Hours ? (
                    <span className="text-white">24/7 Available</span>
                  ) : (
                    <span className="text-white">{contact.businessHours.hours}</span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Social Media */}
            {contact.socialMedia?.length > 0 && (
              <motion.div whileHover={{ scale: 1.01 }} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-6">
                <p className="text-white font-medium mb-4">Connect With Me</p>
                <div className="flex flex-wrap gap-3">
                  {contact.socialMedia.map((social: any, i: number) => {
                    const Icon = socialIcons[social.platform] || Globe;
                    const color = platformColors[social.platform] || '#6C63FF';
                    return (
                      <motion.a key={i} href={social.url} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }}
                        className="group relative w-14 h-14 bg-gray-700/30 rounded-xl flex items-center justify-center transition-all"
                        style={{ '--hover-color': color } as React.CSSProperties}>
                        <Icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" style={{ color }} />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{social.platform}</span>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Map */}
            {contact.location?.mapEmbedUrl && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-2xl overflow-hidden border border-gray-700/30">
                <iframe src={contact.location.mapEmbedUrl} className="w-full h-64" title="Location" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="lg:col-span-2">
            {contact.contactForm?.enabled !== false && (
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Send a Message</h3>
                    <p className="text-sm text-gray-400">I'll get back to you within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-gray-700/30 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                      required disabled={formStatus === 'sending' || formStatus === 'success'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-gray-700/30 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                      required disabled={formStatus === 'sending' || formStatus === 'success'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                    <input type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project Inquiry"
                      className="w-full bg-gray-700/30 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                      required disabled={formStatus === 'sending' || formStatus === 'success'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                    <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your project..." rows={5}
                      className="w-full bg-gray-700/30 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none disabled:opacity-50"
                      required disabled={formStatus === 'sending' || formStatus === 'success'} />
                  </div>
                  <button type="submit" disabled={formStatus === 'sending' || formStatus === 'success'}
                    className={`w-full px-6 py-4 rounded-xl font-medium transition-all text-white flex items-center justify-center gap-2
                      ${formStatus === 'sending' ? 'bg-gray-600 cursor-not-allowed' : formStatus === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_200%] hover:bg-[position:100%_100%] hover:shadow-lg hover:shadow-purple-500/20'}`}>
                    {formStatus === 'sending' && <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />Sending...</>}
                    {formStatus === 'success' && <><CheckCircle className="w-5 h-5" />{contact.contactForm?.successMessage || 'Message Sent!'}</>}
                    {formStatus === 'idle' && <><Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />Send Message</>}
                    {formStatus === 'error' && <><AlertCircle className="w-5 h-5" />Try Again</>}
                  </button>
                  {formStatus === 'error' && <p className="text-red-400 text-sm text-center">{contact.contactForm?.errorMessage || 'Failed to send. Please try again.'}</p>}
                </form>

                {contact.emergencyContact?.name && (
                  <div className="mt-6 pt-6 border-t border-gray-700/30">
                    <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                      <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-400">Emergency Contact</p>
                        <p className="text-white text-sm">{contact.emergencyContact.name}{contact.emergencyContact.relationship ? <span className="text-gray-400 text-xs ml-1">({contact.emergencyContact.relationship})</span> : ''}</p>
                        <div className="flex gap-3 mt-1 text-sm">
                          {contact.emergencyContact.phone && <a href={`tel:${contact.emergencyContact.phone}`} className="text-gray-400 hover:text-white transition-colors">{contact.emergencyContact.phone}</a>}
                          {contact.emergencyContact.email && <a href={`mailto:${contact.emergencyContact.email}`} className="text-gray-400 hover:text-white transition-colors">{contact.emergencyContact.email}</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 pt-8 border-t border-gray-800/50">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} NexusTech. All rights reserved.
            <span className="block md:inline mt-1 md:mt-0"><span className="mx-2">&bull;</span>Built with <Heart className="w-3 h-3 text-red-400 inline animate-pulse" /> by Ahmed Alsaleh</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;

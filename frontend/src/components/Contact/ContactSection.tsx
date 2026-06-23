import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiDribbble, FiYoutube, FiMail, FiMapPin, FiGlobe, FiPhone, FiClock } from 'react-icons/fi';
import { SiGithub, SiLinkedin, SiTwitter, SiDribbble, SiYoutube } from 'react-icons/si';
import { useQuery } from '@tanstack/react-query';
import { contactApi } from '../../services/contactApi';
import SectionTitle from '../shared/SectionTitle';
import ErrorBoundary from '../shared/ErrorBoundary';

const iconMap: Record<string, React.ReactNode> = {
  github: <SiGithub size={24} />,
  linkedin: <SiLinkedin size={24} />,
  twitter: <SiTwitter size={24} />,
  dribbble: <SiDribbble size={24} />,
  youtube: <SiYoutube size={24} />,
};

const ContactSection: React.FC = () => {
  const { data: contact, isLoading } = useQuery({
    queryKey: ['contact', 'public'],
    queryFn: () => contactApi.getPublic().then(r => r.data.data.contact),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return null;
  if (!contact?.isActive) return null;

  const infoCards = [
    contact.email && { icon: <FiMail />, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { icon: <FiPhone />, label: 'Phone', value: contact.phone, href: `tel:${contact.phone}` },
    contact.address?.city && { icon: <FiMapPin />, label: 'Location', value: [contact.address.city, contact.address.state].filter(Boolean).join(', ') },
    contact.businessHours?.days && { icon: <FiClock />, label: 'Hours', value: `${contact.businessHours.days}${contact.businessHours.hours ? `, ${contact.businessHours.hours}` : ''}` },
  ].filter(Boolean);

  const socials = contact.socialMedia || [];

  return (
    <ErrorBoundary>
      <section id="contact" className="relative py-24 md:py-32 px-4">
        <SectionTitle
          title="Get In Touch"
          subtitle="Let's create something amazing together"
          gradient="secondary"
        />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mb-16"
          >
            {socials.map((social: any, i: number) => (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="relative group"
              >
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center transition-all duration-300 group-hover:shadow-lg">
                  {iconMap[social.platform?.toLowerCase()] || <FiGlobe size={24} />}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-xs text-nexus-muted">{social.platform}</span>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {infoCards.map((info: any, i: number) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 text-center group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-nexus-accent text-xl">{info.icon}</span>
                </div>
                <h3 className="text-sm text-nexus-muted mb-1">{info.label}</h3>
                {info.href ? (
                  <a href={info.href} className="text-white font-medium hover:gradient-text transition-all duration-300">
                    {info.value}
                  </a>
                ) : (
                  <p className="text-white font-medium">{info.value}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default ContactSection;

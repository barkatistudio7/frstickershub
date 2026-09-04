import React, { useState } from 'react';
import { ShieldCheck, Mail, FileText, CheckCircle2, Send, Info } from 'lucide-react';

interface StaticPagesProps {
  page: 'about' | 'contact' | 'privacy' | 'terms' | 'dmca';
  isDarkMode?: boolean;
  onBackToHome: () => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ page, onBackToHome }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setIsSent(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-[#102A35]">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <button
          onClick={onBackToHome}
          className="text-xs font-semibold text-[#3F747C] hover:text-[#102A35] flex items-center gap-1 uppercase tracking-wider"
        >
          ← Back to Stickers & Fonts
        </button>
      </div>

      {/* ABOUT PAGE */}
      {page === 'about' && (
        <article className="space-y-6 bg-white rounded-3xl p-8 sm:p-12 border border-[#102A35]/8 shadow-sm">
          <div className="border-b border-[#102A35]/8 pb-4">
            <h1 className="text-3xl sm:text-4xl font-serif-heading font-bold text-[#102A35] tracking-tight">About FR Stickers Hub</h1>
            <p className="text-[#60747B] mt-2 text-base">Your Premier Destination for Transparent Stickers & Stylish Text Fonts</p>
          </div>

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#60747B]">
            <p>
              Welcome to <strong className="text-[#102A35]">FR Stickers Hub</strong>, a curated creative library crafted specifically for mobile chats, social media creators, and typography enthusiasts. Whether you need expressive transparent stickers for WhatsApp, funny memes, romantic expressions, Islamic greetings, or stylish typography font packs, FR Stickers Hub provides instant, free access.
            </p>

            <h2 className="text-xl font-serif-heading font-bold text-[#102A35] pt-3">Our Mission</h2>
            <p>
              Our goal is to give messaging enthusiasts a clean, elegant platform to discover high-resolution PNG transparent stickers and creative font styles with one tap. Every sticker in our collection is precision-formatted with alpha transparency, ensuring crisp, flawless rendering across WhatsApp, Telegram, Instagram Stories, and Facebook.
            </p>

            <h2 className="text-xl font-serif-heading font-bold text-[#102A35] pt-3">Key Highlights</h2>
            <ul className="list-disc pl-5 space-y-2 text-[#60747B]">
              <li><strong className="text-[#102A35]">Transparent PNG/WebP Stickers:</strong> Zero background clutter, ready for WhatsApp and photo editing.</li>
              <li><strong className="text-[#102A35]">Live Font Preview Tool:</strong> Test your custom name or status in real time before downloading.</li>
              <li><strong className="text-[#102A35]">Instant Fancy Text Generator:</strong> Copy cursive, gothic, bubble, and aesthetic text directly to your WhatsApp bio.</li>
              <li><strong className="text-[#102A35]">Mobile-First PWA Support:</strong> Install FR Stickers Hub to your Android, iPhone, or PC for instant native access.</li>
              <li><strong className="text-[#102A35]">100% Free & Fast:</strong> Fast, clean, lightweight performance.</li>
            </ul>
          </div>
        </article>
      )}

      {/* CONTACT PAGE */}
      {page === 'contact' && (
        <article className="space-y-6 bg-white rounded-3xl p-8 sm:p-12 border border-[#102A35]/8 shadow-sm">
          <div className="border-b border-[#102A35]/8 pb-4">
            <h1 className="text-3xl sm:text-4xl font-serif-heading font-bold text-[#102A35] tracking-tight">Contact Us</h1>
            <p className="text-[#60747B] mt-2 text-base">Have a question, feedback, or sticker request? We'd love to hear from you!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-4 text-sm text-[#60747B] leading-relaxed">
              <p>
                FR Stickers Hub values your feedback. If you would like to request new sticker categories, recommend stylish font styles, report an issue, or discuss partnerships, please reach out.
              </p>
              
              <div className="p-5 rounded-2xl bg-[#F8F7F2] border border-[#102A35]/8 space-y-2">
                <div className="flex items-center gap-2 text-[#102A35] font-semibold text-sm">
                  <Mail className="w-4 h-4 text-[#3F747C]" />
                  <span>Direct Inquiries</span>
                </div>
                <p className="text-xs text-[#102A35] font-mono">support@frstickershub.com</p>
                <p className="text-xs text-[#60747B]">Average response time: within 24 to 48 hours.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F7F2] border border-[#102A35]/8">
              {isSent ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-lg text-[#102A35]">Message Sent!</h3>
                  <p className="text-xs text-[#60747B]">Thank you for reaching out. The FR Stickers Hub team will respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#60747B] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#102A35]/15 text-sm text-[#102A35] focus:outline-none focus:border-[#102A35]"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#60747B] mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#102A35]/15 text-sm text-[#102A35] focus:outline-none focus:border-[#102A35]"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#60747B] mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#102A35]/15 text-sm text-[#102A35] focus:outline-none focus:border-[#102A35]"
                      placeholder="Sticker suggestion / Inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#60747B] mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#102A35]/15 text-sm text-[#102A35] focus:outline-none focus:border-[#102A35]"
                      placeholder="Write your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#102A35] hover:bg-[#183E4E] text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </article>
      )}

      {/* PRIVACY POLICY */}
      {page === 'privacy' && (
        <article className="space-y-6 bg-white rounded-3xl p-8 sm:p-12 border border-[#102A35]/8 shadow-sm text-sm text-[#60747B] leading-relaxed">
          <div className="border-b border-[#102A35]/8 pb-4">
            <h1 className="text-3xl font-serif-heading font-bold text-[#102A35]">Privacy Policy</h1>
            <p className="text-xs text-[#60747B] mt-1">Last Updated: January 2026</p>
          </div>
          <p>
            At FR Stickers Hub, your privacy is important to us. This Privacy Policy outlines how we treat information when you browse and download from our catalog.
          </p>
          <h3 className="text-base font-bold text-[#102A35] pt-2">1. Information Collection</h3>
          <p>
            We do not require users to create personal accounts or disclose personal identifiable information (PII) to download stickers or preview fonts. Anonymous aggregate telemetry (such as download counters) is kept purely to surface popular and trending packs.
          </p>
          <h3 className="text-base font-bold text-[#102A35] pt-2">2. Cookies & Advertising</h3>
          <p>
            FR Stickers Hub may display third-party advertisements (such as Google AdSense). These advertising partners may use cookies and web beacons to serve relevant advertisements based on visits to this and other websites.
          </p>
          <h3 className="text-base font-bold text-[#102A35] pt-2">3. Local Storage</h3>
          <p>
            We utilize your browser's local storage solely to store your saved Favorites list and UI preferences on your own device.
          </p>
        </article>
      )}

      {/* TERMS */}
      {page === 'terms' && (
        <article className="space-y-6 bg-white rounded-3xl p-8 sm:p-12 border border-[#102A35]/8 shadow-sm text-sm text-[#60747B] leading-relaxed">
          <div className="border-b border-[#102A35]/8 pb-4">
            <h1 className="text-3xl font-serif-heading font-bold text-[#102A35]">Terms & Conditions</h1>
            <p className="text-xs text-[#60747B] mt-1">Last Updated: January 2026</p>
          </div>
          <p>
            By accessing and using FR Stickers Hub, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h3 className="text-base font-bold text-[#102A35] pt-2">1. Use of Content</h3>
          <p>
            All stickers and fonts provided on FR Stickers Hub are for personal communication, messaging, and creative design purposes. You may not re-sell, bundle, or redistribute these assets commercially without proper author licensing.
          </p>
          <h3 className="text-base font-bold text-[#102A35] pt-2">2. Third-Party Trademarks</h3>
          <p>
            WhatsApp, Telegram, Instagram, Facebook, and other trademarks referenced on this platform are properties of their respective owners. FR Stickers Hub is an independent creative resource.
          </p>
        </article>
      )}

      {/* DMCA */}
      {page === 'dmca' && (
        <article className="space-y-6 bg-white rounded-3xl p-8 sm:p-12 border border-[#102A35]/8 shadow-sm text-sm text-[#60747B] leading-relaxed">
          <div className="border-b border-[#102A35]/8 pb-4">
            <h1 className="text-3xl font-serif-heading font-bold text-[#102A35]">DMCA Copyright Policy</h1>
            <p className="text-xs text-[#60747B] mt-1">Digital Millennium Copyright Act Notice</p>
          </div>
          <p>
            FR Stickers Hub respects the intellectual property rights of others. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please notify our Designated Copyright Agent at <strong>dmca@frstickershub.com</strong> with:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#60747B]">
            <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Direct URL link(s) to the material on FR Stickers Hub that is claimed to be infringing.</li>
            <li>Your contact information including name, telephone number, and email address.</li>
          </ul>
          <p className="pt-2">
            Upon receipt of a valid DMCA notice, we will swiftly remove or disable access to the infringing material.
          </p>
        </article>
      )}
    </div>
  );
};

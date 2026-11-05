import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, HelpCircle, Shield } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 text-slate-800">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>Support & Partnerships</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Contact Our Engineering Team
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Have a question about a calculation, want to suggest a new material preset, report a bug, or inquire about sponsorship opportunities? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Message Received!</h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, <strong className="text-slate-800">{name}</strong>. Our calculation editors will review your inquiry and respond to <strong className="text-slate-800">{email}</strong> within 24 to 48 hours.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={inquiryType}
                    onChange={e => setInquiryType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="general">General Question</option>
                    <option value="density">Material Density / Formula Feedback</option>
                    <option value="feature">New Calculator Feature Request</option>
                    <option value="bug">Bug or Display Error Report</option>
                    <option value="ads">Advertising & Sponsorship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Question regarding decomposed granite compaction"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your inquiry, calculation details, or suggestion in detail..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info & SLA */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>Direct Contacts</span>
            </h3>
            <div className="space-y-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">General Inquiries:</span>
                <strong className="text-slate-800 font-mono">support@materialyardage.com</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Data Privacy Officer:</span>
                <strong className="text-slate-800 font-mono">privacy@materialyardage.com</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Advertising & Direct Buys:</span>
                <strong className="text-slate-800 font-mono">partners@materialyardage.com</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Response Turnaround</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Our engineering team responds to all technical and feedback inquiries within <strong>24 to 48 business hours</strong> (Monday through Friday, 9:00 AM – 5:00 PM EST).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Spam Protection</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Your contact details will never be shared, sold, or used for unsolicited commercial marketing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

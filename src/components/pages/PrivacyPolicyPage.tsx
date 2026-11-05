import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 text-slate-800">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal & Transparency</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: November 5, 2026 · Effective Date: January 1, 2026
        </p>
      </div>

      {/* Introduction */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <p>
          At <strong>Material Yardage</strong> (accessible at <span className="font-mono text-xs text-emerald-800">https://www.materialyardage.com</span>), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Material Yardage and how we use it.
        </p>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through our dedicated contact form or via email.
        </p>
      </section>

      {/* Core Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>No Account Required</span>
          </div>
          <p className="text-xs text-slate-600">
            Calculations run locally in your web browser. We do not store or sell your project dimensions or personal data.
          </p>
        </div>

        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>Google AdSense Disclosures</span>
          </div>
          <p className="text-xs text-slate-600">
            Compliant with Google AdSense third-party vendor policies, cookie guidelines, and personalized advertising controls.
          </p>
        </div>

        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>GDPR & CCPA Compliant</span>
          </div>
          <p className="text-xs text-slate-600">
            Full compliance with California Consumer Privacy Act and European General Data Protection Regulation rights.
          </p>
        </div>
      </div>

      {/* Log Files */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">1. Log Files & Anonymous Analytics</h2>
        <p>
          Material Yardage follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
        </p>
      </section>

      {/* Cookies and Web Beacons */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">2. Cookies and Web Beacons</h2>
        <p>
          Like any other website, Material Yardage uses "cookies". These cookies are used to store information including visitors' preferences, such as selected measurement units (Imperial vs. Metric) and saved Bill of Materials (BOM) items stored via browser localStorage, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>
      </section>

      {/* Google DoubleClick DART Cookie & AdSense (MANDATORY FOR ADSENSE) */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">3. Google DoubleClick DART Cookie & Advertising Partners</h2>
        <p>
          Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.materialyardage.com and other sites on the internet.
        </p>
        <p>
          However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">https://policies.google.com/technologies/ads</a>.
        </p>
        <p>
          Some of our advertising partners may use cookies and web beacons on our site. Our advertising partners include:
        </p>
        <ul className="list-disc list-inside space-y-1 font-medium text-slate-700 pl-2">
          <li><strong>Google AdSense (Publisher ID: pub-2650221548917155):</strong> Contextual and personalized banner advertisements delivered in accordance with Google Publisher Policies.</li>
        </ul>
        <p className="text-xs text-slate-500">
          Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Material Yardage, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
        </p>
      </section>

      {/* CCPA Privacy Rights */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">4. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
        <p>Under the CCPA, California consumers have the right to:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
          <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
          <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data. <strong>Material Yardage does not sell consumer personal information.</strong></li>
        </ul>
        <p>
          If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
        </p>
      </section>

      {/* GDPR Data Protection Rights */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">5. GDPR Data Protection Rights</h2>
        <p>We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
          <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
          <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
          <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
          <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you.</li>
        </ul>
      </section>

      {/* Children's Information */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">6. Children's Information</h2>
        <p>
          Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
        </p>
        <p>
          Material Yardage does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
        </p>
      </section>

      {/* Contact Info */}
      <section className="p-5 bg-slate-100 rounded-xl space-y-2 text-xs text-slate-600">
        <h3 className="font-bold text-slate-900 text-sm">Contacting Our Data Privacy Officer</h3>
        <p>
          If you have any questions about this Privacy Policy or wish to exercise your legal privacy rights, please email us at <strong className="text-slate-900">privacy@materialyardage.com</strong> or visit our Contact page.
        </p>
      </section>
    </div>
  );
};

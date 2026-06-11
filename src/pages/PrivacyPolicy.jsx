import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-teal-400 mb-6 hover:text-teal-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">Privacy Policy</h1>
      <p className="text-teal-400 text-sm mb-8">Reel Chess · Last updated: June 11, 2026</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">

        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. Introduction</h2>
          <p>
            Welcome to Reel Chess ("we", "our", or "us"). We are committed to protecting your personal
            information and your right to privacy. This Privacy Policy explains how we collect, use,
            and safeguard information when you use our mobile application and any related services
            (collectively, the "App").
          </p>
          <p className="mt-2">
            By using the App, you agree to the collection and use of information in accordance with
            this policy. If you do not agree, please discontinue use of the App.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. Information We Collect</h2>
          <p className="font-medium text-gray-200 mb-1">Information you provide directly:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Email address and display name (when creating an account)</li>
            <li>Password (stored securely and never visible to us in plain text)</li>
          </ul>
          <p className="font-medium text-gray-200 mt-3 mb-1">Information collected automatically:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Game statistics (wins, losses, move counts, game duration)</li>
            <li>App usage data (features accessed, session length)</li>
            <li>Device information (operating system version, device type)</li>
            <li>Crash reports and performance data</li>
          </ul>
          <p className="font-medium text-gray-200 mt-3 mb-1">Information we do NOT collect:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Payment or billing information</li>
            <li>Location data</li>
            <li>Contacts or photos from your device</li>
            <li>Microphone or camera data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>Create and manage your account</li>
            <li>Provide and improve the App's features and gameplay</li>
            <li>Display your game history and statistics</li>
            <li>Respond to support inquiries</li>
            <li>Detect and fix bugs or performance issues</li>
            <li>Ensure the security of the App</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. Sharing of Information</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            information only in the following limited circumstances:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>
              <span className="text-gray-200">Service Providers:</span> Trusted third-party services
              that assist us in operating the App (e.g., hosting, analytics), bound by confidentiality obligations.
            </li>
            <li>
              <span className="text-gray-200">Legal Requirements:</span> If required by law or to protect
              the rights and safety of users or others.
            </li>
            <li>
              <span className="text-gray-200">Business Transfers:</span> In the event of a merger or
              acquisition, your data may transfer to the new entity under the same privacy protections.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active or as needed to provide
            services. You may request deletion of your account and associated data at any time by
            contacting us (see Section 9). We will process deletion requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. Security</h2>
          <p>
            We implement industry-standard security measures to protect your data, including encrypted
            data transmission (HTTPS) and secure password storage. However, no method of transmission
            over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Children's Privacy</h2>
          <p>
            The App is not directed at children under the age of 13. We do not knowingly collect
            personal information from children under 13. If you believe a child has provided us with
            personal information, please contact us and we will promptly delete it.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">8. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please contact us using the details in Section 9.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">9. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy, please
            reach out to us at:
          </p>
          <p className="mt-2 text-teal-400 font-medium">support@reelchess.app</p>
          <p className="mt-1 text-gray-400 text-xs">
            (Replace with your actual support email before submitting to the Play Store.)
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify users of any material
            changes by updating the "Last updated" date at the top of this page. Continued use of the
            App after changes constitutes acceptance of the revised policy.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-white/10 text-center text-gray-500 text-xs">
        © 2026 Reel Chess. All rights reserved.
      </div>
    </div>
  );
}
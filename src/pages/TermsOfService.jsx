import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSeo } from '@/lib/useSeo';

export default function TermsOfService() {
  const navigate = useNavigate();
  useSeo(
    'Terms & Conditions – Reel Chess',
    'Read the Reel Chess Terms & Conditions. Learn the rules governing your use of the app, premium subscriptions, tournament play, and in-game purchases.'
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-teal-400 mb-6 hover:text-teal-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">Terms &amp; Conditions</h1>
      <p className="text-teal-400 text-sm mb-8">Reel Chess · Last updated: July 20, 2026</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">

        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. Acceptance of Terms</h2>
          <p>
            Welcome to Reel Chess ("we", "our", or "us"). These Terms &amp; Conditions ("Terms")
            govern your access to and use of the Reel Chess mobile application and any related
            services (collectively, the "App"). By creating an account or using the App, you agree
            to be bound by these Terms. If you do not agree, please discontinue use of the App.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. Eligibility</h2>
          <p>
            You must be at least 13 years of age to create an account and use the App. By using
            the App, you represent that you meet this requirement and that you have the legal
            capacity to enter into these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. Your Account</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activity that occurs under your account. You agree to notify us
            immediately of any unauthorized use of your account. We reserve the right to suspend
            or terminate accounts that violate these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. User Conduct</h2>
          <p>You agree not to use the App to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>Harass, threaten, or abuse other players in chat or gameplay</li>
            <li>Cheat, exploit bugs, or use third-party tools to gain an unfair advantage</li>
            <li>Share offensive, illegal, or inappropriate content via avatars or chat</li>
            <li>Impersonate another person or entity</li>
            <li>Attempt to disrupt or overload the service or its infrastructure</li>
            <li>Reverse engineer, decompile, or attempt to extract source code</li>
          </ul>
          <p className="mt-2">
            Violations may result in account suspension, permanent ban, forfeiture of prizes,
            and loss of in-game currency or purchases without refund.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Subscriptions &amp; Payments</h2>
          <p>
            The App offers "Reel Chess Premium", a recurring subscription billed through Stripe.
            By subscribing, you authorize recurring charges at the displayed price until you
            cancel. You may cancel at any time through your app store account settings;
            cancellation stops future billing but does not refund the current billing period.
          </p>
          <p className="mt-2">
            We do not store your payment card information. All transactions are processed
            securely by Stripe. Currency conversions, taxes, and store fees may apply
            depending on your region.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. In-Game Currency &amp; Cosmetics</h2>
          <p>
            The App includes an in-game digital currency ("coins") earned through daily
            challenges and gameplay. Coins may be spent on cosmetic items such as boards and
            piece sets. Coins and cosmetic items have no real-world monetary value, are
            non-transferable, and may not be exchanged for cash. We reserve the right to adjust,
            remove, or revalue in-game currency and items at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Tournaments</h2>
          <p>
            Premium subscribers may enter player-funded tournaments. Tournament entry requires
            an active Premium subscription. Prize pools are funded by entries and distributed
            according to the published payout structure. If a tournament does not meet the
            minimum player count, all buy-ins are fully refunded.
          </p>
          <p className="mt-2">
            Competitive rules — including disabled cutscenes, move hints, and last-move
            indicators — are enforced during tournament play to ensure fair competition. We
            reserve the right to disqualify players for cheating or conduct violations, which
            may result in forfeiture of prizes and entry fees.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">8. Refund Policy</h2>
          <p>
            Subscription payments are non-refundable except where required by law. Tournament
            buy-ins are refunded in full if the tournament is cancelled or does not reach the
            minimum player count. Cosmetic purchases made with in-game currency are final.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">9. User-Generated Content</h2>
          <p>
            You retain ownership of content you submit (e.g., chat messages, avatars). By
            submitting content, you grant us a worldwide, royalty-free license to display and
            process that content within the App. You are solely responsible for the content
            you share and must not infringe the rights of any third party.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">10. Intellectual Property</h2>
          <p>
            The App, including its software, design, chess assets, cutscenes, and content, is
            owned by Reel Chess and protected by intellectual property laws. You may not copy,
            modify, distribute, or create derivative works without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">11. Disclaimers</h2>
          <p>
            The App is provided "as is" and "as available" without warranties of any kind. We
            do not guarantee that the service will be uninterrupted, error-free, or secure.
            Your use of the App is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">12. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Reel Chess shall not be liable for any
            indirect, incidental, or consequential damages arising from your use of the App,
            including loss of data, in-game currency, or access to tournament prizes.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">13. Account Termination</h2>
          <p>
            You may delete your account at any time from the Settings page. We may suspend or
            terminate your access if you violate these Terms. Upon termination, your right to
            use the App ceases immediately.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">14. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated
            by updating the "Last updated" date at the top of this page. Continued use of the
            App after changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">15. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please reach out to us at:
          </p>
          <p className="mt-2 text-teal-400 font-medium">reelchessgame@gmail.com</p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-white/10 text-center text-gray-500 text-xs">
        © 2026 Reel Chess. All rights reserved.
      </div>
    </div>
  );
}
import React from 'react';
import LegalPage from '../components/LegalPage';

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="29 September 2026"
      sections={[
        {
          paragraphs: [
            'This policy explains what data Sanuk Thai, the Thai learning app ("the app", "we"), collects, why, and what your rights are. The short version: your learning progress lives on your device, an account is optional, we collect a small amount of anonymous usage data that you can switch off, and we never sell your data or show ads.',
          ],
        },
        {
          heading: '1. Data stored on your device',
          paragraphs: [
            'Your learning progress — XP, level, streaks, hearts, gems, completed lessons, spaced-repetition history and settings — is stored locally on your device using browser or app storage. We do not use cookies. Your progress itself is not sent to us unless you enable cloud backup (section 3); anonymous usage events are described separately in section 4. Word pronunciation uses pre-recorded audio files or your device\'s built-in text-to-speech; what you listen to is not sent to us.',
          ],
        },
        {
          heading: '2. Data you give us when you create a profile',
          paragraphs: [
            'Creating a profile is optional and is only needed for the global leaderboard. If you create one, we store the following in our database (hosted by Supabase):',
          ],
          bullets: [
            'Your chosen username, optional display name, bio, avatar and country flag',
            'Your leaderboard score (XP, streak, words mastered, lessons completed)',
            'An internal account identifier',
          ],
        },
        {
          heading: '3. Cloud backup and email',
          paragraphs: [
            'If you link an email address, we store it (via Supabase authentication) so you can sign in on a new device, and we back up your learning-progress snapshot to our database so it can be restored. The email is used only for sign-in links and account recovery — no newsletters, no marketing. Progress backups are kept while your account exists and are deleted with it.',
          ],
        },
        {
          heading: '4. Anonymous usage analytics',
          paragraphs: [
            'To learn which lessons work and where learners get stuck, the app records a small set of usage events in our own database (hosted by Supabase). No third-party analytics or advertising service is involved.',
            'Each event contains only: a random identifier generated on your device (not linked to your name, email or profile), the event name, a timestamp, and a few details such as which lesson it was and your score. The events are: app opened, learning level chosen, lesson started, lesson completed, lesson failed, profile created, email linked, Premium screen viewed and checkout button tapped. We do not store your IP address with these events, though our hosting provider may log it as standard request data.',
            'Legal basis: our legitimate interest in improving the app. You can switch this off at any time under Profile → "Share anonymous usage data"; doing so also deletes the random identifier from your device. Because events are not linked to your account, deleting your account does not remove events already recorded — but they cannot be tied back to you. Usage events are automatically deleted after 13 months.',
          ],
        },
        {
          heading: '5. Payments',
          paragraphs: [
            'Web purchases are processed by Stripe; purchases in the Apple App Store or Google Play are processed by that store. Your card details go directly to the payment processor and never touch our servers — we only receive confirmation that a purchase or subscription is active, together with the processor\'s customer and subscription references, which we store against your account so the app can unlock Premium features. The processor\'s own privacy policy applies to the payment itself (e.g. stripe.com/privacy).',
          ],
        },
        {
          heading: '6. What we do NOT do',
          paragraphs: [],
          bullets: [
            'No advertising and no ad trackers',
            'No sale or sharing of personal data with third parties for their own purposes',
            'No collection of precise location, contacts, photos or other device data',
          ],
        },
        {
          heading: '7. Service providers',
          paragraphs: [
            'We rely on a small number of processors to run the app:',
          ],
          bullets: [
            'GitHub Pages — hosts the app itself; GitHub may log standard technical request data (IP address, user agent)',
            'Supabase — database for profiles, leaderboard, progress backups, subscription status and the anonymous usage events in section 4',
            'Stripe — payment processing',
            'Sentry — crash diagnostics: if the app hits an error, a report with the error details, browser/device type and app version (no account data, no learning content)',
            'Google Fonts — the app loads its fonts from Google\'s servers, which involves your IP address being sent to Google',
          ],
        },
        {
          heading: '8. Your rights (GDPR, PDPA and similar laws)',
          paragraphs: [
            'You can access and correct your profile data in the app at any time. You can permanently delete your account and all associated data yourself from Profile → Delete account (also reachable directly at /delete-account); server-side deletion is immediate. You can object to usage analytics at any time with the switch described in section 4. You also have the right to data portability and to lodge a complaint with your local data-protection authority. To exercise any right, or for any privacy question, email coficollective@gmail.com and we will respond within 30 days.',
          ],
        },
        {
          heading: '9. Children',
          paragraphs: [
            'The app is suitable for general audiences and does not knowingly collect personal data from children under 13. Profiles and payments require whatever age your local law sets for consent; parents who believe a child has created a profile can email us to have it removed.',
          ],
        },
        {
          heading: '10. Changes',
          paragraphs: [
            'If we change this policy we will update this page and the date at the top. Material changes affecting account holders will be flagged in the app.',
          ],
        },
      ]}
    />
  );
}

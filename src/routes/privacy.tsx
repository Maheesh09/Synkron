import { createFileRoute, Link } from "@tanstack/react-router";
import { SyncIcon } from "@/components/synkron/SyncIcon";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <div className="bg-[#04040A] text-[#F1F5F9] min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#04040A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <SyncIcon className="w-5 h-5 text-teal-400" />
            <span className="font-display font-semibold text-lg text-white group-hover:text-teal-300 transition-colors">
              Synkron
            </span>
          </Link>
          <Link
            to="/"
            className="text-slate-400 hover:text-teal-400 text-sm transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-teal-400 text-sm uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1
            className="font-display font-bold text-white"
            style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
          >
            Privacy Policy
          </h1>
          <p className="text-slate-500 mt-4 text-sm">Last updated: June 2026</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-teal-400/20 via-white/[0.07] to-transparent mb-12" />

        {/* Body */}
        <div className="prose-legal">
          <p className="text-slate-300 leading-relaxed">
            This Privacy Policy explains how Synkron ("Synkron", "we", "us", or
            "our") collects, uses, and protects information when you use our
            website and service (the "Service"). By using the Service, you agree
            to the practices described here.
          </p>

          <Section title="1. Who We Are">
            <p>
              Synkron is an automated documentation tool that connects to your
              GitHub repositories, analyzes code changes, and proposes
              documentation updates as pull requests for your review.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>
              <strong className="text-white">Account information.</strong> When
              you sign in with GitHub through Firebase Authentication, we receive
              your name, email address, and profile identifier. We never receive
              or store your GitHub password.
            </p>
            <p>
              <strong className="text-white">Repository access credentials.</strong>{" "}
              To operate, Synkron uses access tokens that allow it to read
              repository contents and open merge requests. Webhook tokens are
              stored as hashed values. Access tokens are stored securely and used
              only to perform the actions you authorize.
            </p>
            <p>
              <strong className="text-white">Repository content.</strong> When
              you connect a repository and push code, Synkron processes commit
              metadata, code diffs, file contents, and documentation files in
              order to generate documentation updates.
            </p>
            <p>
              <strong className="text-white">Usage data.</strong> We collect
              operational logs such as pipeline run records, timestamps, status,
              and error information to run and improve the Service.
            </p>
            <p>
              <strong className="text-white">Cookies and local storage.</strong>{" "}
              We use essential cookies and browser storage to keep you signed in
              and to operate the Service.
            </p>
          </Section>

          <Section title="3. How We Use Information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>
                Provide and operate the Service, including analyzing code changes
                and generating documentation merge requests.
              </li>
              <li>Authenticate you and secure your account.</li>
              <li>Maintain a history of pipeline runs for your dashboard.</li>
              <li>
                Improve documentation quality through our feedback feature, which
                learns from edits you make to generated merge requests.
              </li>
              <li>
                Diagnose problems, monitor performance, and maintain security.
              </li>
            </ul>
          </Section>

          <Section title="4. AI Processing">
            <p>
              Synkron uses third-party large language models, including the Google
              Gemini API, to analyze code changes and draft documentation. Relevant
              portions of your code and documentation are transmitted to these AI
              providers solely to generate the documentation output. Please do not
              connect repositories containing secrets, credentials, or content you
              are not permitted to share with third-party processors. Depending on
              the AI provider and the plan in use, inputs submitted on a free tier
              may be used by the provider to improve their models. Review your AI
              provider's terms for details.
            </p>
          </Section>

          <Section title="5. Service Providers">
            <p>
              We rely on the following providers to operate Synkron, each
              processing data on our behalf under their own terms:
            </p>
            <ul>
              <li>Google Cloud Platform (hosting and infrastructure)</li>
              <li>Firebase Authentication (sign-in)</li>
              <li>Google Gemini API (AI processing)</li>
              <li>MongoDB Atlas (database storage)</li>
              <li>GitHub (repository integration)</li>
            </ul>
          </Section>

          <Section title="6. How We Share Information">
            <p>
              We do not sell your personal information. We share information only
              with the service providers listed above as needed to operate the
              Service, when required by law or to protect the rights and safety of
              our users, and in connection with a merger, acquisition, or sale of
              assets, in which case we will notify you.
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain your information for as long as your account is active or
              as needed to provide the Service. Pipeline run history and learned
              correction patterns are retained to operate the dashboard and
              feedback features until you remove the associated repository or
              delete your account.
            </p>
          </Section>

          <Section title="8. Security">
            <p>
              We take reasonable measures to protect your information, including
              hashing webhook tokens and restricting access to stored credentials.
              No method of transmission or storage is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="9. Your Rights">
            <p>
              Depending on your location, you may have the right to access,
              correct, export, or delete your personal information, and to object
              to or restrict certain processing. To exercise these rights, contact
              us at the email below. If you are in the European Economic Area or
              the United Kingdom, you also have the right to lodge a complaint
              with your local data protection authority.
            </p>
          </Section>

          <Section title="10. Disconnecting and Deletion">
            <p>
              You can disconnect a repository at any time from your dashboard,
              which removes the associated webhook and stops further processing.
              You can request full deletion of your account and stored data by
              contacting us.
            </p>
          </Section>

          <Section title="11. International Data Transfers">
            <p>
              Your information may be processed and stored in countries other than
              your own, including where our service providers operate. We take
              steps to ensure your information is handled in line with this policy.
            </p>
          </Section>

          <Section title="12. Children's Privacy">
            <p>
              The Service is not directed to individuals under the age of 16, or
              the minimum age required by your jurisdiction, and we do not
              knowingly collect their information.
            </p>
          </Section>

          <Section title="13. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will post
              the updated version with a new "Last updated" date. Continued use of
              the Service after changes take effect constitutes acceptance.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              If you have questions about this Privacy Policy, contact us at{" "}
              <a
                href="mailto:contact@synkron.dev"
                className="text-teal-400 hover:text-teal-300 transition-colors"
              >
                contact@synkron.dev
              </a>
              .
            </p>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-white/[0.05] flex items-center justify-between">
          <Link to="/" className="text-slate-500 hover:text-teal-400 text-sm transition-colors">
            ← Back to home
          </Link>
          <Link to="/terms" className="text-slate-500 hover:text-teal-400 text-sm transition-colors">
            Terms & Conditions →
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-white font-display font-semibold text-xl mb-4">{title}</h2>
      <div className="text-slate-400 leading-relaxed space-y-3 [&_strong]:font-medium [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:marker:text-teal-400/60">
        {children}
      </div>
    </section>
  );
}

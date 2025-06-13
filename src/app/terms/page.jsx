'use client';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Agreement to Terms</h2>
          <p>By accessing or using the Diabetes Health Hub platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Health Information Disclaimer</h2>
          <p>The information provided on our platform is for general informational purposes only and is not intended as a substitute for professional medical advice. Always seek the advice of your physician or qualified healthcare provider with questions about your medical condition.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
          <p>When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Privacy and Data Protection</h2>
          <p>Your use of our service is also governed by our Privacy Policy. By using our platform, you consent to our collection and use of your information as described in the Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Content and Services</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Educational materials about diabetes management</li>
            <li>Food and nutrition information</li>
            <li>Equipment recommendations</li>
            <li>Health tracking tools</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. User Responsibilities</h2>
          <p>Users must:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate health information</li>
            <li>Keep account credentials confidential</li>
            <li>Use the platform responsibly</li>
            <li>Not share personal medical advice</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact Information</h2>
          <p>For questions about these Terms of Service, please contact us at:</p>
          <div className="mt-2">
            <p>Phone: (754) 296-0663</p>
            <p>Address: 10/101 Munshipuliya, Lucknow, Uttar Pradesh, India</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform.</p>
        </section>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
'use client';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
          <h3 className="font-medium text-gray-700 mb-2">Personal Information:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Address details</li>
          </ul>

          <h3 className="font-medium text-gray-700 mt-4 mb-2">Health Information:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Diabetes type and diagnosis details</li>
            <li>Blood sugar readings</li>
            <li>Medication information</li>
            <li>Diet and exercise data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide personalized diabetes management recommendations</li>
            <li>Send important updates about our services</li>
            <li>Improve our platform and services</li>
            <li>Contact you regarding your inquiries</li>
            <li>Ensure the security of your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Data Protection</h2>
          <p>We implement appropriate security measures to protect your personal and health information, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of sensitive data</li>
            <li>Secure servers and databases</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Information Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted third parties who assist us in operating our platform, conducting our business, or servicing you.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of communications</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Contact Information</h2>
          <p>For privacy-related inquiries, please contact us at:</p>
          <div className="mt-2">
            <p>Phone: (754) 296-0663</p>
            <p>Address: 10/101 Munshipuliya, Lucknow, Uttar Pradesh, India</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Changes to Privacy Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.</p>
        </section>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export default function PlatformDetails() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">About Our Diabetes Platform</h1>

      <div className="flex flex-col md:flex-row gap-10 items-center">
        <div className="md:w-1/2">
          <img
            src="images\diabetic-platform.jpeg"
            alt="Diabetes management tools"
            width={600}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </div>

        <div className="md:w-1/2 space-y-4">
          <p className="text-lg text-gray-700">
            Our platform is designed to empower people living with diabetes by providing them with smart tools and
            real-time insights. From meal planning and glucose tracking to educational articles and medical equipment
            management—we've got everything covered in one centralized dashboard.
          </p>
          <p className="text-lg text-gray-700">
            Whether you're newly diagnosed or have been managing diabetes for years, we simplify daily care with a
            personalized experience that fits your lifestyle.
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold text-blue-600">Key Features</h2>
        <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
          <li>📊 Smart dashboards to track meals, glucose levels, and medications</li>
          <li>📝 Informative articles written by healthcare professionals</li>
          <li>🍎 Nutrition and food management tailored for diabetic needs</li>
          <li>🩺 Equipment management to help you stay organized with devices</li>
          <li>📬 Contact support and community features to ask questions or share stories</li>
        </ul>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-semibold text-green-600 mb-4">Our Mission</h3>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto">
          We’re here to simplify diabetes care and make it more accessible, human, and proactive. Our mission is to
          support your journey to better health—one decision, one feature, one day at a time.
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [phoneError, setPhoneError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const formatPhoneNumber = (value) => {
        const phoneNumber = value.replace(/\D/g, '');
        if (phoneNumber.length >= 10) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        }
        return phoneNumber;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'phone') {
            const cleaned = value.replace(/\D/g, '');
            setPhoneError(validatePhone(cleaned) ? '' : 'Please enter a valid 10-digit phone number');
        }
    };

    const handlePhoneBlur = () => {
        const cleaned = form.phone.replace(/\D/g, '');
        const formatted = formatPhoneNumber(cleaned);
        setForm(prev => ({
            ...prev,
            phone: formatted,
        }));
        setPhoneError(validatePhone(cleaned) ? '' : 'Please enter a valid 10-digit phone number');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const cleanedPhone = form.phone.replace(/\D/g, '');
        if (!validatePhone(cleanedPhone)) {
            setPhoneError('Please enter a valid 10-digit phone number');
            setIsSubmitting(false);
            return;
        }

        try {
            // Simulate sending data
            console.log('Form submitted:', form);

            // Show thank you message
            setSubmitted(true);

            // Reset form
            setForm({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>
            {submitted ? (
                <p className="text-green-600">Thank you for contacting us! We will get back to you soon.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Name
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                            />
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Email
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                            />
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Phone Number
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                onBlur={handlePhoneBlur}
                                placeholder="e.g. 123-456-7890"
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    phoneError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'
                                }`}
                            />
                        </label>
                        {phoneError && (
                            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Message
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Sending...' : 'Send'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Contact;

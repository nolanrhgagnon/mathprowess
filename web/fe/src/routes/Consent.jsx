import { useState } from 'react';

export default function ConsentPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        consent: false,
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone || !formData.consent) {
            alert('Please fill in all required fields and accept the terms.');
            return;
        }

        setLoading(true);

        const formUrl =
            'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdMRvRzJyCgYf8sU-aIy8nVzgtoX38y-H68HiLDj8W4zey6Gg/formResponse';
        const body = new FormData();
        body.append('entry.2118027202', formData.name);
        body.append('entry.1988847937', formData.phone);
        body.append('entry.203938718', formData.email);
        body.append(
            'entry.1616905870',
            'I agree to receive automated WhatsApp messages from Math Prowess including homework, session summaries, and course materials. I understand I can opt out at any time by replying STOP.',
        );

        try {
            await fetch(formUrl, { method: 'POST', body, mode: 'no-cors' });
            setSubmitted(true);
        } catch (err) {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">You're opted in!</h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Thank you. You'll receive automated messages via WhatsApp at the number you provided. Reply STOP at any time to opt out.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-blue-500">
            <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Message Opt-In</h1>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    By signing up, you agree to receive automated homework, session summaries, and course materials via WhatsApp from Math Prowess. Message frequency varies. Reply STOP to unsubscribe at any time.
                </p>

                <input
                    className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    type="tel"
                    name="phone"
                    placeholder="WhatsApp Phone Number (with country code) *"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <input
                    className="w-full px-4 py-3 mb-6 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    type="email"
                    name="email"
                    placeholder="Email (optional)"
                    value={formData.email}
                    onChange={handleChange}
                />

                <div className="flex items-start gap-3 mb-6">
                    <input
                        type="checkbox"
                        name="consent"
                        id="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-1 accent-gray-900"
                    />
                    <label htmlFor="consent" className="text-xs text-gray-500 leading-relaxed">
                        I agree to receive automated WhatsApp messages from Math Prowess. I understand I can opt out at any time by replying STOP.
                    </label>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-4 bg-gray-900 text-white text-base font-semibold rounded-lg transition-opacity ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                >
                    {loading ? 'Submitting...' : 'Opt In'}
                </button>
            </div>
        </div>
    );
}

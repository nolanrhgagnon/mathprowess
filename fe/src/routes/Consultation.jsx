import { useState } from 'react';
import axios from 'axios';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

const Consultation = (props) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const inputs = [
        { label: "First Name", type: "text", id: "firstName", name: "firstName", placeholder: "Leonhard", value: formData.firstName },
        { label: "Last Name", type: "text", id: "lastName", name: "lastName", placeholder: "Euler", value: formData.lastName },
        { label: "Email", type: "email", id: "email", name: "email", placeholder: "leuler@innernette.com", value: formData.email },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        axios.post(
            '/api/consultations/create/',
            {
                first: formData.firstName,
                last: formData.lastName,
                email: formData.email,
                message: formData.message,
                slug: nanoid(),
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <h2 className="text-3xl font-bold text-gray-300 mb-2">
                    Request a Free Consultation
                </h2>
                <p className="text-gray-600 mb-6">
                    Fill out the form below and I'll get back to you soon.
                </p>

                {submitted ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <svg
                            className="w-12 h-12 text-blue-500 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                        <p className="text-blue-800 font-semibold">
                            Thank you for your submission.
                        </p>
                        <p className="text-blue-600 text-sm">
                            I'll be in touch shortly.
                        </p>
                    </div>
                ) : (
                    <div>
                        {inputs.map((input, n) => (
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-gray-500 font-medium mb-2"
                            >
                                {input.label} 
                            </label>
                            <input
                                type={input.type}
                                id={input.id}
                                name={input.name}
                                value={input.value}
                                onChange={handleChange}
                                required
                                className={`w-full font-mono px-4 
                                            py-2 border border-black 
                                            bg-neutral-900 text-white 
                                            rounded-lg focus:ring-2 
                                            focus:ring-blue-500 
                                            focus:border-transparent 
                                            outline-none transition`}
                                placeholder={input.placeholder}
                            />
                        </div>))}

                        <div className="mb-6">
                            <label
                                htmlFor="message"
                                className="block text-gray-500 font-medium mb-2"
                            >
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className={`w-full font-mono px-4 
                                            py-2 border border-black 
                                            bg-neutral-900 text-white 
                                            rounded-lg focus:ring-2 
                                            focus:ring-blue-700 
                                            focus:border-transparent 
                                            outline-none transition resize-none`}
                                placeholder="How can I help you?"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className={`w-full bg-neutral-600 text-white 
                                        font-semibold py-3 my-3 rounded-lg 
                                        hover:bg-blue-500 transition duration-200 
                                        shadow-md hover:shadow-lg cursor-pointer`}
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Consultation;

import { useState } from 'react';
import axios from 'axios';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

export default function ConsultationForm() {
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
        <div className="flex-1 items-center justify-center p-4">
            <div className="max-w-md w-full">
                <h2 className="text-2xl font-bold text-indigo-400 mb-8">
                    Request a Free Consultation
                </h2>
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
                                className="block text-indigo-500 font-medium mb-2"
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
                                            bg-indigo-950 text-white 
                                            rounded-lg ring-2 ring-blue-200 
                                            focus:ring-2 
                                            focus:ring-blue-500 
                                            focus:border-transparent 
                                            outline-none transition`}
                                placeholder={input.placeholder}
                            />
                        </div>))}

                        <div className="mb-6">
                            <label
                                htmlFor="message"
                                className="block text-indigo-500 font-medium mb-2"
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
                                            bg-indigo-950 text-white 
                                            ring-2 ring-blue-200
                                            rounded-lg focus:ring-2 
                                            focus:ring-blue-500 
                                            focus:border-transparent 
                                            outline-none transition resize-none`}
                                placeholder="How can I help you?"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className={`w-full bg-indigo-800 text-white 
                                        font-semibold py-3 my-3 rounded-lg 
                                        hover:bg-yellow-500 transition duration-200 
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

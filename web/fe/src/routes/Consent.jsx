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
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>You're opted in!</h2>
                    <p style={styles.text}>
                        Thank you. You'll receive automated messages via
                        WhatsApp at the number you provided. Reply STOP at any
                        time to opt out.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Message Opt-In</h1>
                <p style={styles.text}>
                    By signing up, you agree to receive automated homework,
                    session summaries, and course materials via WhatsApp from
                    Math Prowess. Message frequency varies. Reply STOP to
                    unsubscribe at any time.
                </p>

                <input
                    style={styles.input}
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    style={styles.input}
                    type="tel"
                    name="phone"
                    placeholder="WhatsApp Phone Number (with country code) *"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <input
                    style={styles.input}
                    type="email"
                    name="email"
                    placeholder="Email (optional)"
                    value={formData.email}
                    onChange={handleChange}
                />

                <div style={styles.checkboxRow}>
                    <input
                        type="checkbox"
                        name="consent"
                        id="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                    />
                    <label htmlFor="consent" style={styles.checkboxLabel}>
                        I agree to receive automated WhatsApp messages from Math
                        Prowess. I understand I can opt out at any time by
                        replying STOP.
                    </label>
                </div>

                <button
                    style={{
                        ...styles.button,
                        opacity: loading ? 0.7 : 1,
                    }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Opt In'}
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '16px',
        color: '#111',
    },
    text: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '24px',
        lineHeight: '1.6',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    checkboxRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        marginBottom: '24px',
    },
    checkboxLabel: {
        fontSize: '13px',
        color: '#444',
        lineHeight: '1.5',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const form = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.target;

    const name = formElement.from_name.value.trim();
    const email = formElement.from_email.value.trim();
    const phone = formElement.phone.value.trim();
    const message = formElement.message.value.trim();

    let newErrors = {};

    if (!name) {
      newErrors.name = 'Name is required.';
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = 'Name must contain only alphabetic characters.';
    }

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Valid email must contain an "@" and a domain.';
    }

    if (phone && !/^\d{8}$/.test(phone)) {
      newErrors.phone = 'Phone number must contain exactly 8 digits.';
    }

    if (!message) {
      newErrors.message = 'Message cannot be empty.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus('');
    setIsSending(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus('Message sent — thank you!');
      formElement.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('Send failed: please check your connection and try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="contact">
      <div className="container contact__content">
        <h2 className="section__title">Contact</h2>

        <form
          name="contact"
          className="contact__form"
          noValidate
          ref={form}
          onSubmit={handleSubmit}
        >
          <div className="contact__row">
            <label className="contact__field">
              <span>Enter your name <sup>*</sup></span>
              <input type="text" name="from_name" placeholder="Name" />
              {errors.name && (
                <span className="contact__error" style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.name}
                </span>
              )}
            </label>

            <label className="contact__field">
              <span>Enter your email <sup>*</sup></span>
              <input type="email" name="from_email" placeholder="Email" />
              {errors.email && (
                <span className="contact__error" style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.email}
                </span>
              )}
            </label>
          </div>

          <label className="contact__field">
            <span>Enter your phone number</span>
            <input type="tel" name="phone" placeholder="Phone" />
            {errors.phone && (
              <span className="contact__error" style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.phone}
              </span>
            )}
          </label>

          <label className="contact__field">
            <span>Write your message here <sup>*</sup></span>
            <textarea name="message" rows="6" placeholder="Message" />
            {errors.message && (
              <span className="contact__error" style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.message}
              </span>
            )}
          </label>

          <button type="submit" className="btn btn--primary contact__button" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send'}
          </button>

          {status && <p className="contact__status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
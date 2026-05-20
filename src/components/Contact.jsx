import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

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

    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        phone: phone || null,
        message,
        createdAt: serverTimestamp(),
      });

      setStatus('Message sent — thank you!');
      form.reset();
    } catch (err) {
      console.error(err);
      
      // If we got an error, it's often a Firestore permissions error rather than a connection drop
      if (err.message && err.message.includes("Missing or insufficient permissions")) {
        setStatus('Send failed: Permission Denied. Please ensure your Firestore Rules allow writes!');
      } else {
        setStatus(`Send failed: ${err.message || 'please check your connection.'}`);
      }
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
          onSubmit={handleSubmit}
        >
          <div className="contact__row">
            <label className="contact__field">
              <span>Enter your name <sup>*</sup></span>
              <input type="text" name="name" placeholder="Name" />
              {errors.name && (
                <span className="contact__error" style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.name}
                </span>
              )}
            </label>

            <label className="contact__field">
              <span>Enter your email <sup>*</sup></span>
              <input type="email" name="email" placeholder="Email" />
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

          <button type="submit" className="btn btn--primary contact__button">
            Send
          </button>

          {status && <p className="contact__status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
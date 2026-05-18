import React, { useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { PiGithubLogoLight } from "react-icons/pi";
import { SiGmail } from "react-icons/si";

export default function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (res.ok) {
        setStatus('Message sent — thank you!');
        form.reset();
      } else {
        setStatus('Send failed — please try again later.');
      }
    } catch (err) {
      setStatus('Send failed — please check your connection.');
    }
  };

  return (
    <section className="contact">
      <div className="container contact__content">
        <h2 className="section__title">Contact</h2>

        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="contact__form"
          noValidate
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p style={{ display: 'none' }}><label>Don't fill this out: <input name="bot-field" /></label></p>
          <div className="contact__row">
            <label className="contact__field">
              <span>Enter your name <sup>*</sup></span>
              <input type="text" name="name" placeholder="Name" required />
            </label>
            <label className="contact__field">
              <span>Enter your email <sup>*</sup></span>
              <input type="email" name="email" placeholder="Email" required />
            </label>
          </div>

          <label className="contact__field">
            <span>Enter your phone number</span>
            <input type="tel" name="phone" placeholder="Phone" />
          </label>

          <label className="contact__field">
            <span>Write your message here <sup>*</sup></span>
            <textarea name="message" rows="6" placeholder="Message" required />
          </label>

          <button type="submit" className="btn btn--primary contact__button">Send</button>
          {status && <p className="contact__status">{status}</p>}
        </form>

      </div>
    </section>
  );
}

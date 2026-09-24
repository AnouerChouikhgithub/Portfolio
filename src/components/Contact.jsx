import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useI18n } from '../i18n/I18nProvider';

export default function Contact() {
  const { t } = useI18n();
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
      newErrors.name = t('contact.nameRequired');
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = t('contact.nameLetters');
    }

    if (!email) {
      newErrors.email = t('contact.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('contact.emailValid');
    }

    if (phone && !/^\d{8}$/.test(phone)) {
      newErrors.phone = t('contact.phoneValid');
    }

    if (!message) {
      newErrors.message = t('contact.messageRequired');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus('');
    setIsSending(true);

    try {
      if (import.meta.env.PROD) {
        const formData = new URLSearchParams(new FormData(formElement));
        formData.set('form-name', 'contact');

        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });

        if (!response.ok) {
          throw new Error(`Netlify Forms submission failed with status ${response.status}`);
        }
      } else {
        await emailjs.sendForm(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          form.current,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      }

      setStatus(t('contact.sent'));
      formElement.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus(t('contact.failed'));
    } finally {
      setIsSending(false);
    }
    console.log('KEY:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  };

  return (
    <section className="contact">
      <div className="container contact__content">
        <h2 className="section__title">{t('sections.contact')}</h2>

        <form
          name="contact"
          className="contact__form"
          method="POST"
          action="/"
          data-netlify="true"
          netlify-honeypot="bot-field"
          noValidate
          ref={form}
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="bot-field" />
          <div className="contact__row">
            <label className="contact__field">
              <span>{t('contact.nameLabel')} <sup>*</sup></span>
              <input type="text" name="from_name" placeholder={t('contact.name')} />
              {errors.name && (
                <span className="contact__error" style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.name}
                </span>
              )}
            </label>

            <label className="contact__field">
              <span>{t('contact.emailLabel')} <sup>*</sup></span>
              <input type="email" name="from_email" placeholder={t('contact.email')} />
              {errors.email && (
                <span className="contact__error" style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.email}
                </span>
              )}
            </label>
          </div>

          <label className="contact__field">
            <span>{t('contact.phoneLabel')}</span>
            <input type="tel" name="phone" placeholder={t('contact.phone')} />
            {errors.phone && (
              <span className="contact__error" style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.phone}
              </span>
            )}
          </label>

          <label className="contact__field">
            <span>{t('contact.messageLabel')} <sup>*</sup></span>
            <textarea name="message" rows="6" placeholder={t('contact.message')} />
            {errors.message && (
              <span className="contact__error" style={{ color: '#ff4d4f', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.message}
              </span>
            )}
          </label>

          <button type="submit" className="btn btn--primary contact__button" disabled={isSending}>
            {isSending ? t('contact.sending') : t('contact.send')}
          </button>

          {status && <p className="contact__status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
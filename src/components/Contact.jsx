import { useState } from "react";
import { sendContact } from "../lib/sendContact";
import { useI18n } from '../i18n/I18nProvider';
import { useFormValidation } from '../hooks/useFormValidation';

export default function Contact() {
  const { t } = useI18n();
  const { errors, validate, clearErrors } = useFormValidation();
  const [status, setStatus] = useState(null); // { kind: 'ok' | 'error', text }
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    const values = {
      name: formElement.from_name.value.trim(),
      email: formElement.from_email.value.trim(),
      phone: formElement.phone.value.trim(),
      message: formElement.message.value.trim(),
    };

    clearErrors();
    if (!validate(values)) return;

    setStatus(null);
    setIsSending(true);

    try {
      await sendContact({
        from_name: values.name,
        from_email: values.email,
        phone: values.phone,
        message: values.message,
        website: formElement.website.value,
      });
      setStatus({ kind: 'ok', text: t('contact.sent') });
      formElement.reset();
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus({ kind: 'error', text: t('contact.failed') });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="contact">
      <div className="container contact__content">
        <h2 className="section__title">{t('sections.contact')}</h2>

        <form className="contact__form" noValidate onSubmit={handleSubmit}>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="contact__honeypot"
          />

          <div className="contact__row">
            <label className="contact__field">
              <span>{t('contact.nameLabel')} <sup aria-hidden="true">*</sup></span>
              <input type="text" name="from_name" placeholder={t('contact.name')} required autoComplete="name" aria-invalid={Boolean(errors.name)} />
              {errors.name && <span className="contact__error" role="alert">{t(errors.name)}</span>}
            </label>

            <label className="contact__field">
              <span>{t('contact.emailLabel')} <sup aria-hidden="true">*</sup></span>
              <input type="email" name="from_email" placeholder={t('contact.email')} required autoComplete="email" aria-invalid={Boolean(errors.email)} />
              {errors.email && <span className="contact__error" role="alert">{t(errors.email)}</span>}
            </label>
          </div>

          <label className="contact__field">
            <span>{t('contact.phoneLabel')}</span>
            <input type="tel" name="phone" placeholder={t('contact.phone')} autoComplete="tel" aria-invalid={Boolean(errors.phone)} />
            {errors.phone && <span className="contact__error" role="alert">{t(errors.phone)}</span>}
          </label>

          <label className="contact__field">
            <span>{t('contact.messageLabel')} <sup aria-hidden="true">*</sup></span>
            <textarea name="message" rows="6" placeholder={t('contact.message')} required maxLength={5000} aria-invalid={Boolean(errors.message)} />
            {errors.message && <span className="contact__error" role="alert">{t(errors.message)}</span>}
          </label>

          <button type="submit" className="btn btn--primary contact__button" disabled={isSending}>
            {isSending ? t('contact.sending') : t('contact.send')}
          </button>

          {status && (
            <p
              className={`contact__status${status.kind === 'error' ? ' contact__status--error' : ''}`}
              role="status"
            >
              {status.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

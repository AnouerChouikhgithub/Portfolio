import { FaLinkedin } from "react-icons/fa";
import { PiGithubLogoLight } from "react-icons/pi";
import { SiGmail } from "react-icons/si";

export default function Contact() {
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
        >
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="bot-field" />
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
        </form>

      </div>
    </section>
  )
}

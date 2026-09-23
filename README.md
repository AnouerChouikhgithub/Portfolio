# Portfolio

My personal portfolio website, built with React. Showcases my projects, skills, and a contact form to get in touch.

🔗 **Live site:** [chouikh-anouer.netlify.app****]

## Features

- Responsive design
- Project showcase section
- About / Skills section
- Contact ("Connect") form powered by EmailJS

## Tech Stack

- React
- [Tailwind CSS, React Router, Framer Motion]

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

### Running Locally

```bash
npm start
```

The app will run at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## Contact Form Setup (EmailJS)

The Connect/Contact form uses [EmailJS](https://www.emailjs.com/) to send messages directly from the frontend without a backend server.

### 1. Create an EmailJS account

Sign up at [emailjs.com](https://www.emailjs.com/) and create a project.

### 2. Add an Email Service

- Go to **Email Services** in the EmailJS dashboard.
- Add an SMTP service (e.g. Gmail SMTP).
- **Sender account:** use the email address you want messages to be sent *from*.
- If using Gmail, you'll need to generate an **App Password**:
  1. Enable 2-Step Verification on that Google account.
  2. Go to `myaccount.google.com/apppasswords`.
  3. Create a new app password and paste it into the EmailJS "App Password" field.

> ⚠️ **Important:** Don't set the sender and recipient to the *same* Gmail address — Gmail suppresses notifications for self-sent mail. Use a different address as the sender than the one you want notified.

### 3. Create a Template

- Go to **Email Templates** and create a new template.
- On the **Content** tab, set the **To Email** field to the address you want to receive messages at.
- Design your template using variables like `{{name}}`, `{{email}}`, `{{message}}` to match your form fields.

### 4. Add Environment Variables

Create a `.env` file in the project root (and add it to `.gitignore`):

```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

### 5. Send Emails from the Form

```javascript
import emailjs from '@emailjs/browser';

emailjs.send(
  process.env.REACT_APP_EMAILJS_SERVICE_ID,
  process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  {
    name: formData.name,
    email: formData.email,
    message: formData.message,
  },
  process.env.REACT_APP_EMAILJS_PUBLIC_KEY
);
```

## Contact

- Portfolio: [https://chouikh-anouer.netlify.app/]
- Email: [anouer.chouikh2005@mail.com]
- LinkedIn: [[your LinkedIn URL](https://www.linkedin.com/in/anouer-chouikh-303306220/)]

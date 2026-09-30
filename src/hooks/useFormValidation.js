import { useState } from 'react'
import { VALIDATION } from '../constants/formValidation'

/**
 * Contact-form validation hook — mirrors the server-side rules in
 * netlify/functions/contact.mjs (keep both in sync via VALIDATION constants).
 *
 * validate(values) → { field: 'error.key', ... } (empty object when valid)
 * errors are i18n keys so the component can translate them.
 */
export function useFormValidation() {
  const [errors, setErrors] = useState({})

  const validate = ({ name, email, phone, message }) => {
    const nextErrors = {}

    if (!name) {
      nextErrors.name = 'contact.nameRequired'
    } else if (!VALIDATION.namePattern.test(name)) {
      nextErrors.name = 'contact.nameLetters'
    }

    if (!email) {
      nextErrors.email = 'contact.emailRequired'
    } else if (!VALIDATION.emailPattern.test(email)) {
      nextErrors.email = 'contact.emailValid'
    }

    if (phone && !VALIDATION.phonePattern.test(phone)) {
      nextErrors.phone = 'contact.phoneValid'
    }

    if (!message) {
      nextErrors.message = 'contact.messageRequired'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const clearErrors = () => setErrors({})

  return { errors, validate, clearErrors }
}

export default useFormValidation

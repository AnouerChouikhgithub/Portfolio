import { useEffect } from 'react'
import useScrollLock from './useScrollLock'

/**
 * Shared modal accessibility: focus trap, Escape-to-close, body scroll lock,
 * and focus restoration to the trigger element.
 *
 * Extracted from ProjectModal / CommunityModal / EventModal which had
 * three identical copies of this logic.
 *
 * @param {object}   options
 * @param {object}   options.panelRef      Ref to the dialog panel (focus container).
 * @param {function} options.onClose       Close callback (invoked on Escape).
 * @param {object}  [options.triggerRef]   Ref to the element that opened the modal.
 * @param {string}  [options.focusSelector] Selector used to find focusable children.
 */
export function useModalAccessibility({
  panelRef,
  onClose,
  triggerRef,
  enabled = true,
  focusSelector = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
}) {
  useScrollLock(enabled, panelRef)

  useEffect(() => {
    if (!enabled) return undefined
    const panel = panelRef.current
    if (!panel) return undefined

    const previousActiveElement = document.activeElement

    const focusables = Array.from(panel.querySelectorAll(focusSelector))
    const focusFirst = () => focusables[0]?.focus()
    focusFirst()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab' || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const handleHashChange = () => {
      onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('hashchange', handleHashChange)
      const restoreTarget = triggerRef?.current ?? previousActiveElement
      restoreTarget?.focus?.()
    }
  }, [panelRef, onClose, triggerRef, enabled, focusSelector])

  return null
}

export default useModalAccessibility

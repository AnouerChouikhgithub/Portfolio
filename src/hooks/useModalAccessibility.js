import { useEffect } from 'react'
import useScrollLock from './useScrollLock'

// Open dialogs, outermost first. Escape is handled only by the topmost one so a
// nested dialog (e.g. a chapter opened from the community modal) closes alone.
const openDialogStack = []

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
    const layer = {}
    openDialogStack.push(layer)

    // Skip tabIndex -1 controls (e.g. roving gallery thumbnails): the browser
    // never tabs to them, so treating them as the last stop stops the wrap and
    // lets focus escape. Re-query per keypress so late-mounted content counts.
    const getFocusables = () => Array.from(panel.querySelectorAll(focusSelector)).filter((el) => el.tabIndex >= 0)
    const focusFirst = () => getFocusables()[0]?.focus()
    focusFirst()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (openDialogStack[openDialogStack.length - 1] !== layer) return
        event.stopPropagation()
        onClose()
        return
      }

      const focusables = getFocusables()
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
      const layerIndex = openDialogStack.indexOf(layer)
      if (layerIndex !== -1) openDialogStack.splice(layerIndex, 1)
      window.removeEventListener('hashchange', handleHashChange)
      const restoreTarget = triggerRef?.current ?? previousActiveElement
      restoreTarget?.focus?.()
    }
  }, [panelRef, onClose, triggerRef, enabled, focusSelector])

  return null
}

export default useModalAccessibility

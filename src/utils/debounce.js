/**
 * Trailing-edge debounce: fires fn after `wait` ms of silence.
 * The returned function carries `.cancel()` and `.flush()`.
 */
export function debounce(fn, wait = 200) {
  let timeoutId = null
  let lastArgs = null
  let lastThis = null

  const invoke = () => {
    timeoutId = null
    if (lastArgs) {
      fn.apply(lastThis, lastArgs)
      lastArgs = null
      lastThis = null
    }
  }

  const debounced = function debounced(...args) {
    lastArgs = args
    lastThis = this
    if (timeoutId !== null) clearTimeout(timeoutId)
    timeoutId = setTimeout(invoke, wait)
  }

  debounced.cancel = () => {
    if (timeoutId !== null) clearTimeout(timeoutId)
    timeoutId = null
    lastArgs = null
    lastThis = null
  }

  debounced.flush = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      invoke()
    }
  }

  return debounced
}

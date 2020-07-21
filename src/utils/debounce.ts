export const debounce = (fn: any, time: number): () => void => {
  let timeout: NodeJS.Timeout
  return (...args: any): void => {
    const later = () => {
      fn(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, time);
  }
}

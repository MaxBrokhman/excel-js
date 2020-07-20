export const debounce = (fn: any, time: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any) => {
    const later = () => {
      fn(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, time);
  }
}

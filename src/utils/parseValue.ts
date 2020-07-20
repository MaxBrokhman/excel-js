export const parseValue = (value = ''): string => {
  if (value.startsWith('=')) {
    let res
    try {
      res = eval(value.slice(1))
    } catch {
      res = value
    }
    return res
  }
  return value
}

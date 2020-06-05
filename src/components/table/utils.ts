import {ID_SEPARATOR} from './config'

export const mouseUpCleaner = (): void => {
  document.onmousemove = null
  document.onmouseup = null
}

export const getDelta = (start: number, end: number): number => start - end

export const setStyles = (
    resizer: HTMLElement,
    styles: Record<string, string>,
): void => {
  Object.keys(styles).forEach((key) => {
    resizer.style.setProperty(key, styles[key])
  })
}

export const updateBasePropWithDelta = (
    element: HTMLElement,
    prop: string,
    delta: number,
): void => {
  const baseProp = parseInt(getComputedStyle(element).getPropertyValue(prop))
  element.style.setProperty(prop, `${baseProp + delta}px`)
}

export const moveHandler = (
    element: HTMLElement,
    prop: string,
    delta: number
): void => {
  element.style.setProperty(prop, `${-delta}px`)
}

export const parseCellId = (id: string): Array<string> =>
  id?.split(ID_SEPARATOR)

export const getRangeFromLetters = (
    start: string,
    end: string,
): Array<string> => {
  if (start === end) return [start]
  let startCode = start.charCodeAt(0)
  let endCode = end.charCodeAt(0)
  if (startCode > endCode) [startCode, endCode] = [endCode, startCode]
  const res = [String.fromCharCode(startCode)]
  while (startCode !== endCode) {
    res.push(String.fromCharCode(startCode += 1))
  }
  return res
}

export const getRangeFromNumbers = (
    start: number,
    end: number,
): Array<number> => {
  if (start === end) return [start]
  if (start > end) [start, end] = [end, start]
  const res = [start]
  while (start !== end) {
    res.push(start += 1)
  }
  return res
}

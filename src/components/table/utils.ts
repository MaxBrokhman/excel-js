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

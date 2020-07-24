import {
  parseCellId,
  incrementLetter,
  decrementLetter,
  getRangeFromLetters,
  getRangeFromNumbers,
} from '../TableResizer/utils'
import {ID_SEPARATOR} from '../TableResizer/config'

export const findNextCell = (key: string, currentId: string): string => {
  const current = parseCellId(currentId)
  switch (key) {
    case 'Enter':
    case 'ArrowDown':
      return `${Number(current[0]) + 1}${ID_SEPARATOR}${current[1]}`
    case 'Tab':
    case 'ArrowRight':
      return `${current[0]}${ID_SEPARATOR}${incrementLetter(current[1])}`
    case 'ArrowLeft':
      return `${current[0]}${ID_SEPARATOR}${decrementLetter(current[1])}`
    case 'ArrowUp':
      return `${Number(current[0]) - 1}${ID_SEPARATOR}${current[1]}`
  }
}

export const getIdsRange = (
    beginId: Array<string>,
    endId: Array<string>,
): Array<string> => {
  const rowsRange = getRangeFromLetters(beginId[1], endId[1])
  const colsRange = getRangeFromNumbers(
      Number(beginId[0]),
      Number(endId[0]),
  )
  return colsRange.reduce((acc, col) => {
    rowsRange.forEach((row) => acc.push(`${col}${ID_SEPARATOR}${row}`))
    return acc
  }, [])
}

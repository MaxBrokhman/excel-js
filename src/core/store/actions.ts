import {TAction} from './StoreManager'
import {parseValue} from '../../utils/parseValue'
import {defaultStyles} from '../../components/table/config'

export const setCurrentCell = (cell: HTMLElement): TAction => ({
  type: 'SET_CURRENT_CELL',
  payload: cell,
})

export const setSelectedCells = (cells: Array<HTMLElement>): TAction => ({
  type: 'SET_SELECTED_CELLS',
  payload: cells,
})

export const setCurrentText = (value: string): TAction => ({
  type: 'SET_CURRENT_TEXT',
  payload: {
    value,
    parsed: parseValue(value),
  },
})

export const updateCurrentStyles = (data: Record<string, string>): TAction => ({
  type: 'UPDATE_CURRENT_STYLES',
  payload: data,
})

export const updateColState = (data: Record<string, string>): TAction => ({
  type: 'UPDATE_COL_STATE',
  payload: data,
})

export const updateRowState = (data: Record<string, string>): TAction => ({
  type: 'UPDATE_ROW_STATE',
  payload: data,
})

export const resetCurrentStyles = (): TAction => ({
  type: 'RESET_CURRENT_STYLES',
  payload: defaultStyles,
})

export const updateContent = (id: string, value: string): TAction => ({
  type: 'UPDATE_CONTENT',
  payload: {
    [id]: {
      value,
      parsed: parseValue(value),
    },
  },
})

export const setTableName = (data: string): TAction => ({
  type: 'SET_TABLE_NAME',
  payload: data,
})

export const updateOpenDate = (): TAction => ({
  type: 'UPDATE_OPEN_DATE',
})

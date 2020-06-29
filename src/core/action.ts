import {TAction} from './StoreManager';

export const setCurrentCell = (cell: HTMLElement): TAction => ({
  type: 'SET_CURRENT_CELL',
  payload: cell,
})

export const setSelectedCells = (cells: Array<HTMLElement>): TAction => ({
  type: 'SET_SELECTED_CELLS',
  payload: cells,
})

export const setCurrentText = (text: string): TAction => ({
  type: 'SET_CURRENT_TEXT',
  payload: text,
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

import set from 'lodash/set'
import get from 'lodash/get'

import {
  TState,
  TObj,
  TDeepObj,
  TDataState,
} from './types'
import {TAction} from './StoreManager'

export const reducer = (
    state: TState,
    action: TAction,
): TState => {
  switch (action.type) {
    case 'SET_SELECTED_CELLS':
      return {
        ...state,
        selectedCells: (action.payload as Array<HTMLElement>),
      }
    case 'SET_CURRENT_CELL': {
      return {
        ...state,
        currentCell: (action.payload as HTMLElement),
      }
    }
    case 'SET_CURRENT_TEXT': {
      return {
        ...state,
        currentText: {...(action.payload as TObj)},
      }
    }
    case 'UPDATE_COL_STATE': {
      return {
        ...state,
        colState: {
          ...state.colState,
          ...(action.payload as TObj),
        },
      }
    }
    case 'UPDATE_ROW_STATE': {
      return {
        ...state,
        rowState: {
          ...state.rowState,
          ...(action.payload as TObj),
        },
      }
    }
    case 'UPDATE_CURRENT_STYLES': {
      const groupStyles = state.selectedCells.reduce(
          (acc: TDeepObj, cell) => {
            const value = get(state.stylesState, cell.dataset.id)
            ? {
              ...state.stylesState[cell.dataset.id],
              ...(action.payload as TObj),
            }
            : {
              ...(action.payload as TObj),
            }
            set(
                acc,
                cell.dataset.id,
                value,
            )
            return acc
          }, {})
      return {
        ...state,
        stylesState: {
          ...state.stylesState,
          ...groupStyles,
        },
        currentStyles: {
          ...state.currentStyles,
          ...(action.payload as TObj),
        },
      }
    }
    case 'UPDATE_CONTENT':
      return {
        ...state,
        dataState: {
          ...state.dataState,
          ...(action.payload as TDataState),
        },
      }
    case 'RESET_CURRENT_STYLES':
      return {
        ...state,
        currentStyles: {
          ...(action.payload as TObj),
        },
      }
    case 'SET_TABLE_NAME':
      return {
        ...state,
        tableName: (action.payload as string),
      }
    case 'UPDATE_OPEN_DATE':
      return {
        ...state,
        openDate: new Date().toJSON(),
      }
    default:
      return {...state}
  }
}

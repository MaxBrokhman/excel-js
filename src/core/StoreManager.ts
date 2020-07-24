import set from 'lodash/set'
import debounce from 'lodash/debounce'

import {Wp} from './Wp'
import {
  TState,
  TObj,
  TDeepObj,
  TDataState,
} from './store'
import {LocalStorageManager} from './LocalStorageManager'
import {defaultStyles} from '../components/table/config'

export type TAction = {
  type: string,
  payload?: TState[keyof TState],
}

type TListener = Wp

export class StoreManager {
  private _state: TState
  private listeners: Record<string, Array<TListener>>
  private storage: LocalStorageManager
  constructor(initialState: TState, storage: LocalStorageManager) {
    this._state = initialState;
    this.listeners = {}
    this.storage = storage

    this.dispatch = this.dispatch.bind(this)
    this.saveInStorage = debounce(this.saveInStorage.bind(this), 300)
  }

  subscribe(event: keyof TState, listener: TListener): void {
    if (this.listeners[event]) {
      this.listeners[event].push(listener)
    } else {
      this.listeners[event] = [listener]
    }
    set(listener, event, this.state[event])
  }

  unsubscribe(event: string, listener: TListener): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
          (item) => item !== listener
      );
    }
  }

  saveInStorage(state: TState): void {
    this.storage.setTableRecord({
      ...state,
      selectedCells: [],
    })
  }

  set state(newState: TState) {
    Object.keys(this.state).forEach((key: keyof TState) => {
      if (this.state[key] !== newState[key]) {
        const listeners = this.listeners[key] || []
        listeners.forEach((listener) => {
          set(listener, key, newState[key])
        })
      }
    })
    this._state = newState
    this.saveInStorage(this.state)
  }

  get state(): TState {
    return this._state;
  }

  dispatch(action: TAction): void {
    this.state = this.reducer({...this.state}, action)
  }

  reducer(
      state: TState,
      action: TAction,
  ): TState {
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
              if (state.stylesState[cell.dataset.id]) {
                acc[cell.dataset.id] = {
                  ...state.stylesState[cell.dataset.id],
                  ...(action.payload as TObj),
                }
              } else {
                acc[cell.dataset.id] = {
                  ...(action.payload as TObj),
                }
              }
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
            ...defaultStyles,
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
}

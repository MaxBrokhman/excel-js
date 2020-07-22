import {Wp} from './Wp'
import {TState} from './store'
import {LocalStorageManager} from './LocalStorageManager'
import {defaultStyles} from '../components/table/config'
import {debounce} from '../utils/debounce'

export type TAction = {
  type: string,
  payload?: any,
}

export class StoreManager {
  private _state: any
  private listeners: Record<string, Array<any>>
  private storage: LocalStorageManager
  constructor(initialState: any, storage: LocalStorageManager) {
    this._state = initialState;
    this.listeners = {}
    this.storage = storage

    this.dispatch = this.dispatch.bind(this)
    this.saveInStorage = debounce(this.saveInStorage.bind(this), 300)
  }

  subscribe(event: string, listener: any): void {
    if (this.listeners[event]) {
      this.listeners[event].push(listener)
    } else {
      this.listeners[event] = [listener]
    }
    listener[event] = this.state[event]
  }

  unsubscribe(event: string, listener: Wp): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
          (item) => item !== listener
      );
    }
  }

  saveInStorage(state: TState) {
    this.storage.setTableRecord({
      ...state,
      selectedCells: [],
    })
  }

  set state(newState: any) {
    Object.keys(this.state).forEach((key) => {
      if (this.state[key] !== newState[key]) {
        const listeners = this.listeners[key] || []
        listeners.forEach((listener) => {
          listener[key] = newState[key]
        })
      }
    })
    this._state = newState
    this.saveInStorage(this.state)
  }

  get state(): any {
    return this._state;
  }

  dispatch(action: TAction): void {
    this.state = this.reducer({...this.state}, action)
  }

  reducer(state: TState, action: TAction): TState {
    switch (action.type) {
      case 'SET_SELECTED_CELLS':
        return {
          ...state,
          selectedCells: action.payload,
        }
      case 'SET_CURRENT_CELL': {
        return {
          ...state,
          currentCell: action.payload,
        }
      }
      case 'SET_CURRENT_TEXT': {
        return {
          ...state,
          currentText: {...action.payload},
        }
      }
      case 'UPDATE_COL_STATE': {
        return {
          ...state,
          colState: {
            ...state.colState,
            ...action.payload,
          },
        }
      }
      case 'UPDATE_ROW_STATE': {
        return {
          ...state,
          rowState: {
            ...state.rowState,
            ...action.payload,
          },
        }
      }
      case 'UPDATE_CURRENT_STYLES': {
        const groupStyles = state.selectedCells.reduce((acc: any, cell) => {
          if (state.stylesState[cell.dataset.id]) {
            acc[cell.dataset.id] = {
              ...(state.stylesState as any)[cell.dataset.id],
              ...action.payload,
            }
          } else {
            acc[cell.dataset.id] = {
              ...action.payload,
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
            ...action.payload,
          },
        }
      }
      case 'UPDATE_CONTENT':
        return {
          ...state,
          dataState: {
            ...state.dataState,
            ...action.payload,
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
          tableName: action.payload,
        }
      default:
        return {...state}
    }
  }
}

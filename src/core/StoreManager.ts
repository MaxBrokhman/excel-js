import {Wp} from './Wp';
import {TState} from './store';

export type TAction = {
  type: string,
  payload: any,
}

export class StoreManager {
  private _state: any
  private listeners: Record<string, Array<any>>
  constructor(initialState: any) {
    this._state = initialState;
    this.listeners = {};

    this.dispatch = this.dispatch.bind(this);
  }

  subscribe(event: string, listener: any): void {
    if (this.listeners[event]) {
      this.listeners[event].push(listener);
    } else {
      this.listeners[event] = [listener];
    }
    listener[event] = this.state[event];
  }

  unsubscribe(event: string, listener: Wp): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
          (item) => item !== listener
      );
    }
  }

  set state(newState: any) {
    Object.keys(this.state).forEach((key) => {
      if (this.state[key] !== newState[key]) {
        const listeners = this.listeners[key] || []
        this._state = newState;
        listeners.forEach((listener) => {
          listener[key] = newState[key]
        });
      }
    });
  }

  get state(): any {
    return this._state;
  }

  dispatch(action: TAction): void {
    this.state = this.reducer({...this.state}, action);
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
          currentText: action.payload,
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
        return {
          ...state,
          currentStyles: {
            ...state.currentStyles,
            ...action.payload,
          },
        }
      }
      default:
        return {...state}
    }
  }
}

import set from 'lodash/set'
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import keys from 'lodash/keys'

import {
  TState,
  TListener,
  TAction,
} from './types'
import {LocalStorageManager} from '../LocalStorageManager'
import {reducer} from './reducer'

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
    get(this.listeners, event)
      ? this.listeners[event].push(listener)
      : set(
          this.listeners,
          event,
          [listener],
      )
    set(
        listener,
        event,
        get(this.state, event),
    )
  }

  unsubscribe(event: string, listener: TListener): void {
    get(this.listeners, event)
      && set(
          this.listeners,
          event,
          this.listeners[event].filter(
              (item) => item !== listener
          ),
      )
  }

  saveInStorage(state: TState): void {
    this.storage.setTableRecord({
      ...state,
      selectedCells: [],
    })
  }

  set state(newState: TState) {
    keys(this.state).forEach((key: keyof TState) => {
      if (get(this.state, key) !== get(newState, key)) {
        const listeners = get(this.listeners, key) || []
        listeners.forEach((listener) => set(
            listener,
            key,
            newState[key],
        ))
      }
    })
    this._state = newState
    this.saveInStorage(this.state)
  }

  get state(): TState {
    return this._state;
  }

  dispatch(action: TAction): void {
    this.state = reducer({...this.state}, action)
  }
}

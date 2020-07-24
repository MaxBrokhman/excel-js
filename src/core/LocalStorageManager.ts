import {TState} from './store/types'

export class LocalStorageManager {
  private prefix = 'excel:'
  private _currentTableId: string = null

  set currentTableId(id: string) {
    this._currentTableId = id
  }

  get currentTableId(): string {
    return this._currentTableId
  }

  setTableRecord(value: TState): void {
    localStorage.setItem(
        `${this.prefix}${this.currentTableId}`,
        JSON.stringify(value),
    )
  }

  getTableRecord(key?: string): TState {
    return key
      ? JSON.parse(localStorage.getItem(`${this.prefix}${key}`))
      : JSON.parse(
          localStorage.getItem(`${this.prefix}${this.currentTableId}`)
      )
  }

  getAllTableRecords(): Array<string> {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).includes(this.prefix)) {
        keys.push(
            this.parseTableId(localStorage.key(i))
        )
      }
    }
    return keys
  }

  parseTableId(str: string): string {
    return str.replace(this.prefix, '')
  }

  removeCurrentTable(): void {
    localStorage.removeItem(`${this.prefix}${this.currentTableId}`)
  }
}

export const localStorageManager = new LocalStorageManager()

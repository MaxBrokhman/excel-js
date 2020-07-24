import {TState} from './store'

export class LocalStorageManager {
  private prefix: string = window.location.href
  public tablePrefix = 'excel:'
  private _currentTableId: string = null

  set currentTableId(id: string) {
    this._currentTableId = id
  }

  get currentTableId(): string {
    return this._currentTableId
  }

  setValue<T>(key: string, value: T): void {
    localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(value))
  }

  getValue<T>(key: string): T {
    const value = localStorage.getItem(`${this.prefix}_${key}`)
    return value && JSON.parse(value)
  }

  setTableRecord(value: TState): void {
    localStorage.setItem(
        `${this.tablePrefix}${this.currentTableId}`,
        JSON.stringify(value),
    )
  }

  getTableRecord(key?: string): TState {
    return key
      ? JSON.parse(localStorage.getItem(`${this.tablePrefix}${key}`))
      : JSON.parse(
          localStorage.getItem(`${this.tablePrefix}${this.currentTableId}`)
      )
  }

  getAllTableRecords(): Array<string> {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).includes(this.tablePrefix)) {
        keys.push(
            this.parseTableId(localStorage.key(i))
        )
      }
    }
    return keys
  }

  parseTableId(str: string): string {
    return str.replace(this.tablePrefix, '')
  }

  removeCurrentTable(): void {
    localStorage.removeItem(`${this.tablePrefix}${this.currentTableId}`)
  }
}

export const localStorageManager = new LocalStorageManager()

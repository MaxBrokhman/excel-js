export type TValue = any

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

  setValue(key: string, value: TValue): void {
    localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(value))
  }

  getValue(key: string): TValue {
    const value = localStorage.getItem(`${this.prefix}_${key}`)
    return value && JSON.parse(value)
  }

  setTableRecord(value: any): void {
    localStorage.setItem(
        `${this.tablePrefix}${this.currentTableId}`,
        JSON.stringify(value),
    )
  }

  getTableRecord(): any {
    return JSON.parse(
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
}

export const localStorageManager = new LocalStorageManager()

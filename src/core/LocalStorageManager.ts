export type TValue = Array<Record<string, string>>

export class LocalStorageManager {
  private prefix: string = window.location.href

  setValue(key: string, value: TValue): void {
    localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(value))
  }

  getValue(key: string): TValue {
    const value = localStorage.getItem(`${this.prefix}_${key}`)
    return value && JSON.parse(value)
  }
}

export const localStorageManager = new LocalStorageManager()

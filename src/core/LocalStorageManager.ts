export class LocalStorageManager {
  private prefix: string = window.location.href
  constructor(prefix?: string) {
    this.prefix = prefix
  }

  setValue(key: string, value: string | Record<string, unknown>): void {
    localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(value))
  }

  getValue(key: string): string | Record<string, unknown> {
    const value = localStorage.getItem(`${this.prefix}_${key}`)
    return value && JSON.parse(value)
  }
}

export const localStorageManager = new LocalStorageManager()

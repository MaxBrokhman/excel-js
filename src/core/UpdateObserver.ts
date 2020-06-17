type TData = Record<string, string | number> | string
type TCallback = (data?: TData) => void

export class UpdateObserver {
  public subscriptions: Record<string, Array<TCallback>> = Object.create(null)

  public subscribe(event: string, callback: TCallback): void {
    if (this.subscriptions[event]) {
      this.subscriptions[event].push(callback)
    } else {
      this.subscriptions[event] = [callback]
    }
  }

  public unsubscribe(event: string, callback: TCallback): void {
    if (this.subscriptions[event]) {
      this.subscriptions[event] =
        this.subscriptions[event].filter((sub) => sub !== callback)
    }
  }

  public dispatch(event: string, data?: TData): void {
    if (this.subscriptions[event]) {
      this.subscriptions[event].forEach((sub) => sub(data))
    }
  }
}

export const updater = new UpdateObserver()

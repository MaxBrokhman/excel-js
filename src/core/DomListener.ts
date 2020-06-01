import {getListenerName} from '../utils/getMethodName'
import {get} from '../utils/get'

type TProps = {
  root: HTMLElement,
  listeners?: Array<string>,
}

export class DomListener {
  public root: HTMLElement
  private listenersMapper: Record<string, () => void> = {}
  public listeners: Array<string> = []
  constructor({
    root,
    listeners = [],
  }: TProps) {
    this.root = root
    this.listeners = listeners
  }
  initListeners(): void {
    this.listeners.forEach((listener) => {
      const method = getListenerName(listener)
      if (get(this, method)) {
        const currentListener = get(this, method).bind(this)
        this.listenersMapper[method] = currentListener
        this.root.addEventListener(listener, currentListener)
      }
    })
  }
  removeListeners(): void {
    this.listeners.forEach((listener) => {
      const method = getListenerName(listener)
      this.root.removeEventListener(listener, this.listenersMapper[method])
    })
    this.listenersMapper = {}
  }
}

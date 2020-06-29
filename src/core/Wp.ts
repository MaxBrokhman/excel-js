import {store} from './store'

export abstract class Wp extends HTMLElement {
  static get observedAttributes(): Array<string> {
    return []
  }
  public store: any
  constructor() {
    super()
    this.store = store
  }

  /* converting all of the observed attributes
  of the component to properties of state*/
  get observedProps(): Array<string> {
    const observed = (this.constructor as any).observedAttributes
    if (!observed) return []
    return observed.map((item: string) => {
      const propArr = item.split('-')
      if (propArr.length < 2) return item
      return propArr.map((prop, i) => i > 0
        ? `${prop[0].toUpperCase()}${prop.slice(1)}`
        : prop
      ).join('')
    })
  }

  get html(): string {
    return ``
  }

  render(): void {
    this.innerHTML = this.html
  }

  connectedCallback(): void {
    this.observedProps.forEach((prop) => {
      this.store.subscribe(prop, this);
    })
    this.render()
  }
}

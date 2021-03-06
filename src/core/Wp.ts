import map from 'lodash/map'

import {app} from '../index'
import {Router} from './Router'
import {StoreManager} from './store/StoreManager'
import {TState} from './store/types'


export abstract class Wp extends HTMLElement {
  static get observedAttributes(): Array<string> {
    return []
  }
  public store: StoreManager
  public router: Router
  constructor() {
    super()
    this.store = app.store
    this.router = app.router
  }

  /* converting all of the observed attributes
  of the component to properties of state*/
  get observedProps(): Array<string> {
    const observed = (this.constructor as typeof Wp).observedAttributes
    if (!observed) return []
    return map(observed, (item: string) => {
      const propArr = item.split('-')
      if (propArr.length < 2) return item
      return map(propArr, (prop, i) => i > 0
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
    this.observedProps.forEach((prop: keyof TState) =>
      this.store.subscribe(prop, this))
    this.render()
  }
}

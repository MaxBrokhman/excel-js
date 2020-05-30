import {DomListener} from './DomListener'

export class ExcelComponent extends DomListener {
  toHTML(): string {
    return ''
  }
  init(): void {
    this.initListeners()
  }
  destroy(): void {
    this.removeListeners()
  }
}

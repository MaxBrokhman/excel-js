import {DomListener} from './DomListener'

type TProps = {
  className?: string,
  root: HTMLElement,
  listeners?: Array<string>,
}

export class ExcelComponent extends DomListener {
  public className?: string
  constructor({
    root,
    className,
    listeners,
  }: TProps) {
    super({root, listeners})
    this.className = className
  }
  toHTML(): string {
    return ''
  }
  init(): void {
    if (this.className) this.root.className = this.className
    this.initListeners()
  }
  destroy(): void {
    this.removeListeners()
  }
}

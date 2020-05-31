import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './templateCreator';

type TOptions = {
  listeners?: Array<string>,
}

interface TEvent {
  target: {
    dataset: {
      resize?: string,
    }
  }
}

type TProps = {
  root: HTMLElement,
  options: TOptions,
  className: string,
}

export class Table extends ExcelComponent {
  constructor({
    root,
    options = {},
    className,
  }: TProps) {
    super({
      root,
      listeners: options.listeners,
      className,
    })
  }
  toHTML(): string {
    this.root.innerHTML = createTable(15)
    return this.root.innerHTML
  }

  onMousedown(event: TEvent): void {
    if (event.target.dataset && event.target.dataset.resize) {
      console.log('mousedown')
    }
  }
}

import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './templateCreator';

type TOptions = {
  listeners?: Array<string>,
}

interface IEvent extends MouseEvent {
  target: ITarget,
}

interface ITarget extends EventTarget {
  closest: (selector: string) => HTMLElement,
  dataset: {
    resize?: string,
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

  onMousedown(evt: IEvent): void {
    if (evt.target.dataset && evt.target.dataset.resize) {
      const parent = evt.target.closest('[data-type="resizable"]')
      const coords = parent.getBoundingClientRect()
      const columnCells = this.root.querySelectorAll(
          `td[data-col="${parent.dataset['col']}"]`
      )
      document.onmousemove = (moveEvt: IEvent) => {
        const delta = moveEvt.pageX - coords.right
        const newWidth = `${delta}px`
        parent.style.width = newWidth
        columnCells.forEach((cell: HTMLElement) => {
          cell.style.width = newWidth
        })
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}

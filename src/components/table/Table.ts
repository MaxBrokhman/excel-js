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

const documentMouseUpHandler = () => {
  document.onmousemove = null
  document.onmouseup = null
}

const getDeltaInPixels = (start: number, end: number) => `${start - end}px`

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
    if (evt.target.dataset && evt.target.dataset.resize === 'col') {
      const parent = evt.target.closest('[data-type="resizable"]')
      const coords = parent.getBoundingClientRect()
      const columnCells = this.root.querySelectorAll(
          `td[data-col="${parent.dataset['col']}"]`
      )
      document.onmousemove = (moveEvt: IEvent) => {
        const delta = getDeltaInPixels(moveEvt.pageX, coords.right)
        parent.style.width = delta
        columnCells.forEach((cell: HTMLElement) => {
          cell.style.width = delta
        })
      }
      document.onmouseup = documentMouseUpHandler
    }

    if (evt.target.dataset && evt.target.dataset.resize === 'row') {
      const row = evt.target.closest('tr')
      const coords = row.getBoundingClientRect()
      document.onmousemove = (moveEvt: IEvent) => {
        row.style.height = getDeltaInPixels(moveEvt.pageY, coords.bottom)
      }
      document.onmouseup = documentMouseUpHandler
    }
  }
}

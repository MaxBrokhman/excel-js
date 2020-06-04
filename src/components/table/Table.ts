import {ExcelComponent} from '../../core/ExcelComponent'
import {createTable} from './templateCreator'
import {IEvent, TProps} from './types'
import {
  getDelta,
  mouseUpCleaner,
  moveHandler,
  setStyles,
  updateBasePropWithDelta,
} from './utils'
import {
  COL_RESIZE_PARENT_SELECTOR,
  ROW_RESIZE_PARENT_SELECTOR,
  colMoveStyles,
  rowMoveStyles,
  COL_RESIZER_MOVE_PROP,
  ROW_RESIZER_MOVE_PROP,
  colCleanedStyles,
  rowCleanedStyles,
  COL_PARENT_PROP_DYNAMIC,
  ROW_PARENT_PROP_DYNAMIC,
} from './config'
import {TableSelection} from './TableSelection'

export class Table extends ExcelComponent {
  private selection: TableSelection
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

  init(): void {
    super.init()
    this.selection = new TableSelection()
    this.selection.select(this.root.querySelector('[data-id="1:A"]'))
  }

  onClick(evt: IEvent): void {
    if (evt.target.dataset.id) {
      this.selection.select(evt.target)
    }
  }

  onMousedown(evt: IEvent): void {
    if (evt.target.dataset && evt.target.dataset.resize) {
      const resizer = evt.target
      const resizeType = resizer.dataset.resize
      let delta: number
      const isColResize = resizeType === 'col'
      const parent = isColResize
        ? resizer.closest(COL_RESIZE_PARENT_SELECTOR)
        : resizer.closest(ROW_RESIZE_PARENT_SELECTOR)
      const coordsProvider = isColResize
        ? resizer
        : parent
      const coords = coordsProvider.getBoundingClientRect()
      const stylesOnMove = isColResize
        ? colMoveStyles
        : rowMoveStyles
      setStyles(resizer, stylesOnMove)
      document.onmousemove = (moveEvt: IEvent) => {
        delta = isColResize
          ? getDelta(moveEvt.pageX, coords[COL_RESIZER_MOVE_PROP])
          : getDelta(moveEvt.pageY, coords[ROW_RESIZER_MOVE_PROP])
        isColResize
        ? moveHandler(resizer, COL_RESIZER_MOVE_PROP, delta)
        : moveHandler(resizer, ROW_RESIZER_MOVE_PROP, delta)
      }
      document.onmouseup = () => {
        mouseUpCleaner()
        const stylesToClean = isColResize
          ? colCleanedStyles
          : rowCleanedStyles
        setStyles(resizer, stylesToClean)
        const parentPropToUpdate = isColResize
          ? COL_PARENT_PROP_DYNAMIC
          : ROW_PARENT_PROP_DYNAMIC
        updateBasePropWithDelta(parent, parentPropToUpdate, delta)
        isColResize && this.root.querySelectorAll(
            `td[data-col="${parent.dataset['col']}"]`
        ).forEach((cell: HTMLElement) => updateBasePropWithDelta(
            cell,
            COL_PARENT_PROP_DYNAMIC,
            delta
        ))
      }
    }
  }
}

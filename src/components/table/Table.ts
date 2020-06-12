import {createTable} from './templateCreator'
import {IEvent} from './types'
import {
  getDelta,
  mouseUpCleaner,
  moveHandler,
  setStyles,
  updateBasePropWithDelta,
  parseCellId,
  getRangeFromLetters,
  getRangeFromNumbers,
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
  ID_SEPARATOR,
} from './config'
import {TableSelection} from './TableSelection'

class TableSection extends HTMLElement {
  private selection: TableSelection
  constructor() {
    super()
    this.className = 'excel-table'
    this.onmousedown = (evt: IEvent) => this.onMousedownHandler(evt)
    this.onclick = (evt: IEvent) => this.onClickHandler(evt)
  }

  connectedCallback(): void {
    this.innerHTML = this.html
    this.selection = new TableSelection()
    this.selection.select(this.querySelector('[data-id="1:A"]'))
  }

  get html(): string {
    return `
      <h2 class="visually-hidden">Excel table</h2>
      ${createTable(15)}
    `
  }

  onClickHandler(evt: IEvent): void {
    if (evt.target.dataset.id) {
      if (evt.shiftKey) {
        const target = parseCellId(evt.target.dataset.id)
        const current = parseCellId(this.selection.current?.dataset?.id)
        const rowsRange = getRangeFromLetters(current[1], target[1])
        const colsRange = getRangeFromNumbers(
            Number(current[0]),
            Number(target[0])
        )
        const ids = colsRange.reduce((acc, col) => {
          rowsRange.forEach((row) => acc.push(`${col}${ID_SEPARATOR}${row}`))
          return acc
        }, [])
        const selectedCells: Array<HTMLElement> = ids.map((id) =>
          this.querySelector(`[data-id="${id}"]`))
        this.selection.selectGroup(selectedCells)
      } else {
        this.selection.select(evt.target)
      }
    }
  }

  onMousedownHandler(evt: IEvent): void {
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
        isColResize && this.querySelectorAll(
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

customElements.define('table-section', TableSection)

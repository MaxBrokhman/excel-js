import set from 'lodash/set'
import keys from 'lodash/keys'
import get from 'lodash/get'
import map from 'lodash/map'

import {
  COL_PARENT_PROP_DYNAMIC,
  ROW_PARENT_PROP_DYNAMIC,
} from '../../core/TableResizer/config'
import {Wp} from '../../core/Wp'
import {
  updateColState,
  updateRowState,
  setCurrentText,
  updateContent,
  updateOpenDate,
} from '../../core/store/actions'
import {
  parseCellId,
  updateStyleProp,
} from '../../core/TableResizer/utils'
import {IEvent} from './types'
import {TableResizer} from '../../core/TableResizer/TableResizer'
import {keyboardKeys, FIRST_CELL_ID} from './config'
import {TCurrentText} from '../../core/store/types'
import {TableSelection} from '../../core/TableSelection/TableSelection'
import {findNextCell, getIdsRange} from '../../core/TableSelection/utils'
import {renderTable} from './renderTable'

export class TableSection extends Wp {
  static get observedAttributes(): Array<string> {
    return [
      'col-state',
      'row-state',
      'current-text',
      'current-styles',
    ]
  }

  private tableResizer: TableResizer
  private _currentText: TCurrentText
  private selection: TableSelection
  public current: HTMLElement = null
  constructor() {
    super()
    this.className = 'excel-table'
    this._currentText = {}
    this.selection = new TableSelection(this.store)
  }

  get html(): string {
    return `
      <h2 class="visually-hidden">Excel table</h2>
      ${renderTable({
    colState: this.store.state.colState,
    dataState: this.store.state.dataState,
    rowState: this.store.state.rowState,
    styles: this.store.state.stylesState,
  })}
    `
  }

  set currentStyles(styles: Record<string, string>) {
    this.store.state.selectedCells.forEach((cell) =>
      keys(styles).forEach((key) => set(
          cell.style,
          key,
          styles[key],
      )))
  }

  set colState(data: Record<string, string>) {
    keys(data).forEach((key) =>
      this.updateColumnWidth(key, data[key]))
  }

  set rowState(data: Record<string, string>) {
    keys(data).forEach((key) =>
      this.updateColumnWidth(key, data[key]))
  }

  get currentText(): TCurrentText {
    return this._currentText
  }

  set currentText(newData: TCurrentText) {
    if (newData.value !== this._currentText.value) {
      this.store.state.selectedCells.forEach((cell: HTMLElement) => {
        cell.textContent = newData.value
      })
      this._currentText = newData
    }
  }

  connectedCallback(): void {
    super.connectedCallback()
    const firstCell: HTMLElement = this.querySelector(FIRST_CELL_ID)
    this.selection.select(firstCell)
    this.oninput = () => this.inputHandler()
    this.onkeydown = (evt: KeyboardEvent) => this.keydownHandler(evt)
    this.onclick = (evt: IEvent) => this.tableClickHandler(evt)
    this.onmousedown = (evt: IEvent) => this.mousedownHandler(evt)
    this.store.dispatch(updateOpenDate())
  }

  inputHandler(): void {
    const content = this.store.state.currentCell.textContent
    this.store.dispatch(setCurrentText(content))
    this.store.dispatch(
        updateContent(
            get(this.store.state.currentCell, ['dataset', 'id']),
            content,
        )
    )
  }

  keydownHandler(evt: KeyboardEvent): void {
    if (keyboardKeys.includes(evt.key) && !evt.shiftKey) {
      evt.preventDefault()
      const newCellId = findNextCell(
          evt.key,
          get(this.store.state.currentCell, ['dataset', 'id']),
      )
      const nextCell: HTMLElement = this.querySelector(
          `[data-id="${newCellId}"]`
      )
      nextCell && this.selection.select(nextCell)
    }
  }

  tableClickHandler(evt: IEvent): void {
    if (evt.target.dataset.id) {
      if (evt.shiftKey) {
        const target = parseCellId(evt.target.dataset.id)
        const current = parseCellId(this.store.state.currentCell?.dataset?.id)
        const ids = getIdsRange(current, target)
        const selectedCells: Array<HTMLElement> = map(ids, (id) =>
          this.querySelector(`[data-id="${id}"]`))
        this.selection.selectGroup(selectedCells)
      } else {
        this.selection.select(evt.target)
      }
    }
  }

  mousedownHandler(evt: IEvent): void {
    const resizer = evt.target
    const resizeType = resizer.dataset.resize
    if (resizeType) {
      this.tableResizer = new TableResizer(resizer, resizeType)
      this.tableResizer.prepareResizer()
      document.onmousemove = (moveEvt: IEvent) => {
        this.tableResizer.moveResizer(moveEvt.pageX, moveEvt.pageY)
        document.onmouseup = () => {
          const resizedData = this.tableResizer.finishMoving()
          this.tableResizer.isColumnResize
            ? this.store.dispatch(updateColState(resizedData))
            : this.store.dispatch(updateRowState(resizedData))
          this.tableResizer = null
        }
      }
    }
  }

  updateColumnWidth(col: string, value: string): void {
    this.querySelectorAll(
        `[data-col="${col}"]`
    ).forEach((cell: HTMLElement) => updateStyleProp({
      element: cell,
      prop: COL_PARENT_PROP_DYNAMIC,
      value,
    }))
  }

  updateRowHeight(row: string, value: string): void {
    updateStyleProp({
      element: this.querySelector(`.row[data-index="${row}"]`),
      prop: ROW_PARENT_PROP_DYNAMIC,
      value,
    })
  }
}

customElements.define('table-section', TableSection)

import {
  ID_SEPARATOR,
  MIN_CHAR_CODE,
  MAX_CHAR_CODE,
  COL_PARENT_PROP_DYNAMIC,
  ROW_PARENT_PROP_DYNAMIC,
} from '../../controllers/TableController/config'
import {Wp} from '../../core/Wp'
import {
  updateColState,
  updateRowState,
  setCurrentText,
  updateContent,
} from '../../core/action'
import {
  parseCellId,
  incrementLetter,
  decrementLetter,
  getRangeFromLetters,
  getRangeFromNumbers,
  updateStyleProp,
} from '../../controllers/TableController/utils'
import {IEvent} from './types'
import {TableResizer} from '../../controllers/TableController/TableResizer'
import {TableSelection} from './TableSelection'

export class TableSection extends Wp {
  static get observedAttributes(): Array<string> {
    return ['col-state', 'row-state', 'current-text']
  }

  private tableResizer: TableResizer
  private selection: TableSelection
  private readonly rowsCount: number = 15
  private readonly idSeperator: string = ID_SEPARATOR
  private readonly maxCharCode: number = MAX_CHAR_CODE
  private readonly minCharCode: number = MIN_CHAR_CODE
  constructor() {
    super()
    this.className = 'excel-table'
  }

  get html(): string {
    return `
      <h2 class="visually-hidden">Excel table</h2>
      ${this._renderTable()}
    `
  }

  get colState(): Record<string, string> {
    return JSON.parse(this.getAttribute('col-state'))
  }

  set colState(data: Record<string, string>) {
    this.setAttribute('col-state', JSON.stringify(data))
  }

  get rowState(): Record<string, string> {
    return JSON.parse(this.getAttribute('row-state'))
  }

  set rowState(data: Record<string, string>) {
    this.setAttribute('row-state', JSON.stringify(data))
  }

  get currentText(): string {
    return this.getAttribute('current-text')
  }

  set currentText(value: string) {
    this.setAttribute('current-text', value)
  }

  attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string,
  ): void {
    if (oldValue !== newValue) {
      switch (name) {
        case 'col-state':
          Object.keys(this.colState).forEach((key) =>
            this.updateColumnWidth(key, this.colState[key]))
          break
        case 'row-state':
          Object.keys(this.rowState).forEach((key) =>
            this.updateColumnWidth(key, this.rowState[key]))
          break
        case 'current-text':
          this.store.state.selectedCells.forEach((cell: HTMLElement) => {
            cell.textContent = newValue
          })
          break
      }
    }
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.selection = new TableSelection(this.store)
    const firstCell: HTMLElement = this.querySelector('[data-id="1:A"]')
    this.selection.select(firstCell)
    this.oninput = () => {
      const content = this.store.state.currentCell.textContent
      this.store.dispatch(setCurrentText(content))
      this.store.dispatch(updateContent({
        [this.store.state.currentCell.dataset.id]: content,
      }))
    }
    this.onkeydown = (evt: KeyboardEvent) => this.keydownHandler(evt)
    this.onclick = (evt: IEvent) => this.tableClickHandler(evt)
    this.onmousedown = (evt: IEvent) => this.mousedownHandler(evt)
  }

  keydownHandler(evt: KeyboardEvent): void {
    const keys = [
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
    ]

    if (keys.includes(evt.key) && !evt.shiftKey) {
      evt.preventDefault()
      const newCellId = this._findNextCellId(evt.key)
      const nextCell: HTMLElement = this.querySelector(
          `[data-id="${newCellId}"]`
      )
      if (nextCell) {
        this.selection.select(nextCell)
      }
    }
  }

  _findNextCellId(key: string): string {
    const current = parseCellId(this.store.state.currentCell?.dataset?.id)
    switch (key) {
      case 'Enter':
      case 'ArrowDown':
        return `${Number(current[0]) + 1}${ID_SEPARATOR}${current[1]}`
      case 'Tab':
      case 'ArrowRight':
        return `${current[0]}${ID_SEPARATOR}${incrementLetter(current[1])}`
      case 'ArrowLeft':
        return `${current[0]}${ID_SEPARATOR}${decrementLetter(current[1])}`
      case 'ArrowUp':
        return `${Number(current[0]) - 1}${ID_SEPARATOR}${current[1]}`
    }
  }

  private _renderCell(col: string, headerContent: number): string {
    const td = document.createElement('td')
    td.className = 'cell'
    td.dataset.index = `${headerContent}`
    td.dataset.col = col
    const cellId = `${headerContent}${this.idSeperator}${col}`
    td.dataset.id = cellId
    td.setAttribute('contenteditable', '')
    const storedStyles = this.store.state.stylesState[cellId]
    if (storedStyles) {
      Object.keys(storedStyles).forEach((key) => {
        td.style[(key as any)] = storedStyles[key]
      })
    }
    if (this.store.state.colState[col]) {
      td.style.width = this.store.state.colState[col]
    }
    td.textContent = this.store.state.dataState[cellId] || ''
    return td.outerHTML
  }

  tableClickHandler(evt: IEvent): void {
    if (evt.target.dataset.id) {
      if (evt.shiftKey) {
        const target = parseCellId(evt.target.dataset.id)
        const current = parseCellId(this.store.state.currentCell?.dataset?.id)
        const rowsRange = getRangeFromLetters(current[1], target[1])
        const colsRange = getRangeFromNumbers(
            Number(current[0]),
            Number(target[0]),
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

  private _renderRow(headerContent: number, colsCount: number): string {
    const cells = []
    for (let i = 0; i < colsCount; i++) {
      cells.push(this._renderCell(
          String.fromCharCode(this.minCharCode + i),
          headerContent
      ))
    }
    return `
      <tr 
        class="row" 
        data-index="${headerContent}"
        ${this.store.state.rowState[headerContent]
          ? `style="height: ${this.store.state.rowState[headerContent]}"`
          : ''}
      >
        <td 
          class="row-info table-header-cell"
          data-index="${headerContent}"
        >
          <div class="row-resize" data-resize="row"></div>
          ${headerContent}
        </td>
        ${cells.join('')}
      </tr>
    `
  }

  private _renderHeaderCell(headerCell: string): string {
    return `
      <th 
        class="row-data table-header-cell" 
        data-type="resizable" 
        data-col="${headerCell}"
        ${this.store.state.colState[headerCell]
            ? `style="width: ${this.store.state.colState[headerCell]};"`
            : '' }
      >
        ${headerCell}
        <div class="col-resize" data-resize="col"></div>
      </th>
    `
  }

  private _renderTable(): string {
    const colsCount = this.maxCharCode - this.minCharCode
    const rows = []
    const headerCells = []
    for (let i = 0; i <= colsCount; i++) {
      headerCells.push(
          this._renderHeaderCell(
              String.fromCharCode(this.minCharCode + i),
          )
      )
    }
    for (let i = 0; i < this.rowsCount; i++) {
      rows.push(this._renderRow(i + 1, colsCount))
    }
    return `
      <table class="table">
        <thead>
          <tr class="row">
            <th class="row-info table-header-cell"></th>
            ${headerCells.join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.join('')}
        </tbody>
      </table>
    `
  }
}

customElements.define('table-section', TableSection)

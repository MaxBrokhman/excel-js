import {TableSelection} from '../../components/table/TableSelection';
import {UpdateObserver} from '../../core/UpdateObserver';
import {
  ID_SEPARATOR,
  COL_PARENT_PROP_DYNAMIC,
  ROW_PARENT_PROP_DYNAMIC,
} from './config';
import {
  parseCellId,
  incrementLetter,
  decrementLetter,
  getRangeFromNumbers,
  getRangeFromLetters,
  updateStyleProp,
} from './utils';
import {IEvent} from '../../components/table/types';
import {LocalStorageManager, TValue} from '../../core/LocalStorageManager';
import {TableResizer} from './TableResizer';

type TProps = {
  table: HTMLElement,
  selection: TableSelection,
  updater: UpdateObserver,
  storage: LocalStorageManager,
}

export class TableController {
  private table: HTMLElement
  private selection: TableSelection
  private updater: UpdateObserver
  private storage: LocalStorageManager
  private tableResizer: TableResizer
  constructor({
    selection,
    table,
    updater,
    storage,
  }: TProps) {
    this.table = table
    this.selection = selection
    this.updater = updater
    this.storage = storage
    this.tableResizer = null

    this.formulaInputHandler = this.formulaInputHandler.bind(this)
    this.formulaDoneHandler = this.formulaDoneHandler.bind(this)
  }

  init(): void {
    this.updater.subscribe('formula-input', this.formulaInputHandler)
    this.updater.subscribe('formula-done', this.formulaDoneHandler)
    this.table.onkeydown = (evt: KeyboardEvent) => this.keydownHandler(evt)
    this.table.oninput = () => this.cellChangeHandler()
    this.table.onclick = (evt: IEvent) => this.tableClickHandler(evt)
    this.table.onmousedown = (evt: IEvent) => this.mousedownHandler(evt)
    const resizedCols = this.extractResizedCols()
    const resixedRows = this.extractResizedRows()
    Object.keys(resizedCols).forEach((key) =>
      this.updateColumnWidth(key, resizedCols[key]))
    Object.keys(resixedRows).forEach((key) =>
      this.updateRowHeight(key, resixedRows[key]))
    const filledCells = this.extractContentData()
    Object.keys(filledCells).forEach((key) =>
      this.updateContent(key, filledCells[key]))
    this.changeActiveCell(this.table.querySelector('[data-id="1:A"]'))
  }

  formulaInputHandler(data: string): void {
    this.selection.current.textContent = data
    this.storeContentData({[this.selection.current.dataset.id]: data})
  }

  formulaDoneHandler(): void {
    const cell = this.selection.current
    cell.focus()
    // cell.setSelectionRange(cell.textContent.length, cell.textContent.length)
  }

  cellChangeHandler(): void {
    const content = this.selection.current.textContent
    console.log(this.selection.current, content);

    this.updater.dispatch('cell-change', content)
    this.storeContentData({[this.selection.current.dataset.id]: content})
  }

  changeActiveCell(nextCell: HTMLElement): void {
    this.selection.select(nextCell)
    this.cellChangeHandler()
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
      const nextCell: HTMLElement = this.table.querySelector(
          `[data-id="${newCellId}"]`
      )
      if (nextCell) {
        this.changeActiveCell(nextCell)
      }
    }
  }

  tableClickHandler(evt: IEvent): void {
    if (evt.target.dataset.id) {
      if (evt.shiftKey) {
        const target = parseCellId(evt.target.dataset.id)
        const current = parseCellId(this.selection.current?.dataset?.id)
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
          this.table.querySelector(`[data-id="${id}"]`))
        this.selection.selectGroup(selectedCells)
      } else {
        this.changeActiveCell(evt.target)
      }
    }
  }

  storeContentData(data: Record<string, string>): void {
    this.storeData('table-content-data', data)
  }

  extractContentData(): TValue {
    return this.storage.getValue('table-content-data') || {}
  }

  storeResizedCols(data: Record<string, string>):void {
    this.storeData('table-resize-cols', data)
  }

  storeResizedRows(data: Record<string, string>): void {
    this.storeData('table-resize-rows', data)
  }

  storeData(key: string, data: Record<string, string>): void {
    const stored = this.storage.getValue(key)
    if (stored) {
      this.storage.setValue(key, {...stored, ...data})
    } else {
      this.storage.setValue(key, {...data})
    }
  }

  extractResizedCols(): TValue {
    return this.storage.getValue('table-resize-cols') || {}
  }

  extractResizedRows(): TValue {
    return this.storage.getValue('table-resize-rows') || {}
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
          this.tableResizer.isColumnResize &&
            Object.keys(resizedData).forEach((key) =>
              this.updateColumnWidth(key, resizedData[key]))
          this.tableResizer.isColumnResize
            ? this.storeResizedCols(resizedData)
            : this.storeResizedRows(resizedData)
          this.tableResizer = null
        }
      }
    }
  }

  updateContent(id: string, content: string): void {
    this.table.querySelector(`[data-id="${id}"]`).textContent = content
  }

  updateColumnWidth(col: string, value: string): void {
    this.table.querySelectorAll(
        `[data-col="${col}"]`
    ).forEach((cell: HTMLElement) => updateStyleProp({
      element: cell,
      prop: COL_PARENT_PROP_DYNAMIC,
      value,
    }))
  }

  updateRowHeight(row: string, value: string): void {
    updateStyleProp({
      element: this.table.querySelector(`.row[data-index="${row}"]`),
      prop: ROW_PARENT_PROP_DYNAMIC,
      value,
    })
  }

  _findNextCellId(key: string): string {
    const current = parseCellId(this.selection.current?.dataset?.id)
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
}

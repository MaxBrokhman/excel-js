import {TableSelection} from '../../components/table/TableSelection';
import {UpdateObserver} from '../../core/UpdateObserver';
import {
  ID_SEPARATOR,
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
} from './config';
import {
  parseCellId,
  incrementLetter,
  decrementLetter,
  getRangeFromNumbers,
  getRangeFromLetters,
  setStyles,
  getDelta,
  moveHandler,
  mouseUpCleaner,
  updateBasePropWithDelta,
  updateStyleProp,
} from './utils';
import {IEvent} from '../../components/table/types';
import {LocalStorageManager, TValue} from '../../core/LocalStorageManager';

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
    this.changeActiveCell(this.table.querySelector('[data-id="1:A"]'))
    const resizedCells = this.extractTableData()
    resizedCells.forEach((cell) => {
      cell.col && this.updateColumnWidth(cell.col, cell.value)
      cell.row && this.updateRowHeight(cell.row, cell.value)
    })
  }

  formulaInputHandler(data: string): void {
    this.selection.current.textContent = data
  }

  formulaDoneHandler(): void {
    const cell = this.selection.current
    cell.focus()
    // cell.setSelectionRange(cell.textContent.length, cell.textContent.length)
  }

  cellChangeHandler(): void {
    this.updater.dispatch('cell-change', this.selection.current.textContent)
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
            Number(target[0])
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

  storeTableData(data: Record<string, string>):void {
    const stored = this.storage.getValue('table-resize-data')
    if (stored) {
      this.storage.setValue('table-resize-data', [...stored, data])
    } else {
      this.storage.setValue('table-resize-data', [data])
    }
  }

  extractTableData(): TValue {
    return this.storage.getValue('table-resize-data') || []
  }

  mousedownHandler(evt: IEvent): void {
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
        const resultValue = updateBasePropWithDelta(
            parent,
            parentPropToUpdate,
            delta,
        )
        isColResize &&
          this.updateColumnWidth(parent.dataset['col'], resultValue)
        isColResize
          ? this.storeTableData({
            col: parent.dataset.col,
            value: resultValue,
          })
          : this.storeTableData({
            row: parent.dataset.index,
            value: resultValue,
          })
      }
    }
  }

  updateColumnWidth(col: string, value: string): void {
    this.table.querySelectorAll(
        `td[data-col="${col}"]`
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

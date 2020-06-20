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
import {
  setStyles,
  getDelta,
  moveHandler,
  mouseUpCleaner,
  updateBasePropWithDelta,
} from './utils'

export class TableResizer {
  public isColumnResize: boolean
  private resizer: HTMLElement
  private delta: number
  private type: string
  private parent: HTMLElement
  private coords: DOMRect
  private parentDataProp: string
  constructor(resizer: HTMLElement, type: string) {
    this.resizer = resizer
    this.type = type
    this.delta = 0
    this.isColumnResize = this.type === 'col'
    this.parent = this.findParent()
    this.coords = null
    this.parentDataProp = this.isColumnResize
      ? 'col'
      : 'index'
  }

  public prepareResizer(): void {
    setStyles(this.resizer, this.getMoveStyles())
    this.coords = this.getCoords()
  }

  public moveResizer(x: number, y: number): void {
    this.delta = this.computeDelta(x, y)
    this.isColumnResize
      ? moveHandler(this.resizer, COL_RESIZER_MOVE_PROP, this.delta)
      : moveHandler(this.resizer, ROW_RESIZER_MOVE_PROP, this.delta)
  }

  public finishMoving(): Record<string, string> {
    mouseUpCleaner()
    setStyles(this.resizer, this.getCleanStyles())
    const resultValue = updateBasePropWithDelta(
        this.parent,
        this.getUpdatingProp(),
        this.delta,
    )
    return {
      [this.parent.dataset[this.parentDataProp]]: resultValue,
    }
  }

  private findParent(): HTMLElement {
    return this.isColumnResize
      ? this.resizer.closest(COL_RESIZE_PARENT_SELECTOR)
      : this.resizer.closest(ROW_RESIZE_PARENT_SELECTOR)
  }

  private getCoords(): DOMRect {
    return this.isColumnResize
      ? this.resizer.getBoundingClientRect()
      : this.parent.getBoundingClientRect()
  }

  private getMoveStyles(): Record<string, string> {
    return this.isColumnResize
      ? colMoveStyles
      : rowMoveStyles
  }

  private computeDelta(x: number, y: number): number {
    return this.isColumnResize
      ? getDelta(x, this.coords[COL_RESIZER_MOVE_PROP])
      : getDelta(y, this.coords[ROW_RESIZER_MOVE_PROP])
  }

  private getCleanStyles(): Record<string, string> {
    return this.isColumnResize
      ? colCleanedStyles
      : rowCleanedStyles
  }

  private getUpdatingProp(): string {
    return this.isColumnResize
      ? COL_PARENT_PROP_DYNAMIC
      : ROW_PARENT_PROP_DYNAMIC
  }
}

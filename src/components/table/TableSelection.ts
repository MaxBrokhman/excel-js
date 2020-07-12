import {SELECTED_CELL_CLASSNAME} from '../../controllers/TableController/config'
import {StoreManager} from '../../core/StoreManager'
import {
  setCurrentCell,
  setCurrentText,
  setSelectedCells,
  resetCurrentStyles,
} from '../../core/action'

export class TableSelection {
  public current: HTMLElement = null
  private store: StoreManager
  constructor(store: StoreManager) {
    this.store = store
    this.store.subscribe('currentStyles', this)
  }

  set currentStyles(styles: Record<string, string>) {
    this.store.state.selectedCells.forEach((cell: any) =>
      Object.keys(styles).forEach((key) => {
        cell.style[key] = styles[key]
      }))
  }

  select(element: HTMLElement): void {
    this.clear()
    this.store.dispatch(setSelectedCells([element]))
    this.current = element
    this.setSelected(element)
    this.store.dispatch(setCurrentCell(element))
    element.focus()
    this.store.dispatch(setCurrentText(element.textContent))
  }

  selectGroup(group: Array<HTMLElement>): void {
    this.clear()
    this.store.dispatch(setSelectedCells(group))
    group.forEach((element) => this.setSelected(element))
  }

  private clear(): void {
    this.store.state.selectedCells.forEach((element: HTMLElement) =>
      element.classList && element.classList.remove(SELECTED_CELL_CLASSNAME))
    this.store.dispatch(resetCurrentStyles())
  }

  private setSelected(element: Element): void {
    element?.classList.add(SELECTED_CELL_CLASSNAME)
  }
}

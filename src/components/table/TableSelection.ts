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
    if (this.current === element) return
    this.clear()
    this.store.dispatch(setSelectedCells([element]))
    this.current = element
    this.setSelected(element)
    this.store.dispatch(setCurrentCell(element))
    element.focus()
    const storedContent = this.store.state.dataState[element.dataset.id]
    this.store.dispatch(
        setCurrentText(storedContent ? storedContent.value : '')
    )
  }

  selectGroup(group: Array<HTMLElement>): void {
    this.clear()
    this.store.dispatch(setSelectedCells(group))
    group.forEach((element) => this.setSelected(element))
  }

  private clear(): void {
    this.store.state.selectedCells.forEach((element: HTMLElement) => {
      element.classList && element.classList.remove(SELECTED_CELL_CLASSNAME)
      console.log('all cleared', this.store.state.currentText)
      element.textContent = this.store.state.currentText.parsed
    })
    this.store.dispatch(resetCurrentStyles())
  }

  private setSelected(element: Element): void {
    element?.classList.add(SELECTED_CELL_CLASSNAME)
  }
}

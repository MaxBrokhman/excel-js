import get from 'lodash/get'

import {StoreManager} from '../../core/store/StoreManager'
import {
  setCurrentCell,
  setCurrentText,
  setSelectedCells,
  resetCurrentStyles,
} from '../../core/store/actions'
import {SELECTED_CELL_CLASSNAME} from '../TableResizer/config'

export class TableSelection {
  public current: HTMLElement = null
  private store: StoreManager
  constructor(store: StoreManager) {
    this.store = store
  }

  public select(element: HTMLElement): void {
    if (this.current === element) return
    this.clear()
    this.store.dispatch(setSelectedCells([element]))
    this.current = element
    this.setSelected(element)
    this.store.dispatch(setCurrentCell(element))
    element.focus()
    const storedContent = this.store.state.dataState[element.dataset.id]
    this.store.dispatch(
        setCurrentText(
            get(
                storedContent,
                'value',
                '',
            )
        )
    )
  }

  public selectGroup(group: Array<HTMLElement>): void {
    this.clear()
    this.store.dispatch(setSelectedCells(group))
    group.forEach((element) => this.setSelected(element))
  }

  private clear(): void {
    this.store.state.selectedCells.forEach((element: HTMLElement) => {
      element.classList && element.classList.remove(SELECTED_CELL_CLASSNAME)
      element.textContent = this.store.state.currentText.parsed
    })
    this.store.dispatch(resetCurrentStyles())
  }

  private setSelected(element: Element): void {
    element && element.classList.add(SELECTED_CELL_CLASSNAME)
  }
}

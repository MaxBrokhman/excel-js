import {SELECTED_CELL_CLASSNAME} from './config'

export class TableSelection {
  private group: Array<HTMLElement> = []
  public current: HTMLElement = null
  select(element: HTMLElement): void {
    this.clear()
    this.group.push(element)
    this.current = element
    this.setSelected(element)
    element.focus()
  }

  selectGroup(group: Array<HTMLElement>): void {
    this.clear()
    this.group = group
    this.group.forEach((element) => this.setSelected(element))
  }

  private clear(): void {
    this.group.forEach((element) =>
      element.classList.remove(SELECTED_CELL_CLASSNAME))
    this.group = []
  }

  private setSelected(element: Element): void {
    element?.classList.add(SELECTED_CELL_CLASSNAME)
    element?.setAttribute('contenteditable', '')
  }
}

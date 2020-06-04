export class TableSelection {
  private group: Array<HTMLElement> = []

  select(element: HTMLElement): void {
    this.clear()
    this.group.push(element)
    element?.classList?.add('selected')
    element?.setAttribute('contenteditable', '')
  }

  selectGroup(): void {
    this.clear()
  }

  private clear(): void {
    this.group.forEach((element) => {
      element.classList.remove('selected')
    })
    this.group = []
  }
}

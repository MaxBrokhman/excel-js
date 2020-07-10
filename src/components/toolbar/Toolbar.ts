import {Wp} from '../../core/Wp'
import {updateCurrentStyles} from '../../core/action'
import {buttons} from './config'

export type TButton = {
  icon: string,
  title: string,
  data: Record<string, string>,
}

class ToolbarSection extends Wp {
  private buttons: Array<HTMLElement>
  static get observedAttributes(): Array<string> {
    return ['current-cell']
  }

  constructor() {
    super()
    this.className = 'excel-toolbar'
    this.buttons = []
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.buttons = buttons.map((button) => {
      const toolbarButton = this.createButton(button)
      toolbarButton.dataset.data = JSON.stringify(button.data)
      toolbarButton.onclick = () => {
        this.store.dispatch(updateCurrentStyles(button.data))
        this.toggleActive(toolbarButton)
      }
      this.appendChild(toolbarButton)
      return toolbarButton
    })
  }

  createButton({icon, title}: TButton): HTMLElement {
    const button = document.createElement('button')
    button.className = 'button'
    button.setAttribute('title', title)
    button.innerHTML = `<span class="material-icons">${icon}</span>`
    return button
  }

  get html(): string {
    return `
      <h2 class="visually-hidden">Excel table toolbar</h2>
    `
  }

  set currentCell(cell: HTMLElement) {
    this.buttons.forEach((btn) => btn.classList.remove('active'))
    if (cell.dataset && cell.dataset.id) {
      const styles = this.store.state.stylesState[cell.dataset.id]
      if (styles) {
        Object.keys(styles).forEach((style) => {
          const btn = this.buttons.find((btn) => {
            const btnData = JSON.parse(btn.dataset.data)
            return btnData[style] &&
            btnData[style] === styles[style]
          })
          btn && btn.classList.add('active')
        })
      }
    }
  }

  private toggleActive(elem: HTMLElement): void {
    elem.classList.contains('active')
      ? elem.classList.remove('active')
      : elem.classList.add('active')
  }
}

customElements.define('toolbar-section', ToolbarSection)

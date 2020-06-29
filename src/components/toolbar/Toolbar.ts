import {Wp} from '../../core/Wp'
import {updateCurrentStyles} from '../../core/action'
import {buttons} from './config'

export type TButton = {
  icon: string,
  title: string,
  data: Record<string, string>,
}

class ToolbarSection extends Wp {
  constructor() {
    super()
    this.className = 'excel-toolbar'
  }

  connectedCallback(): void {
    super.connectedCallback()
    buttons.forEach((button) => {
      const toolbarButton = this.createButton(button)
      toolbarButton.onclick = () =>
        this.store.dispatch(updateCurrentStyles(button.data))
      this.appendChild(toolbarButton)
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
}

customElements.define('toolbar-section', ToolbarSection)

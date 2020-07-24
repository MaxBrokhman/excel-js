import map from 'lodash/map'
import keys from 'lodash/keys'
import get from 'lodash/get'

import {Wp} from '../../core/Wp'
import {updateCurrentStyles} from '../../core/store/actions'
import {buttons} from './config'
import {defaultStyles} from '../table/config'

export type TButton = {
  icon: string,
  title: string,
  data: Record<string, string>,
}

class ToolbarSection extends Wp {
  private buttons: Array<HTMLElement>
  static get observedAttributes(): Array<string> {
    return ['current-cell', 'current-styles']
  }

  constructor() {
    super()
    this.className = 'excel-toolbar'
    this.buttons = []
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.buttons = map(buttons, (button) => {
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
    this.updateButtons(cell)
  }

  set currentStyles(value: Record<string, string>) {
    this.updateButtons(this.store.state.currentCell)
  }

  private toggleActive(elem: HTMLElement): void {
    elem.classList.contains('active')
      ? elem.classList.remove('active')
      : elem.classList.add('active')
  }

  private updateButtons(cell: HTMLElement): void {
    this.buttons.forEach((btn) => btn.classList.remove('active'))
    const id = get(cell, ['dataset', 'id'])
    if (id) {
      const styles = get(this.store.state.stylesState, id, defaultStyles)
      keys(styles).forEach((style) => {
        const btn = this.buttons.find((btn) => {
          const btnData = JSON.parse(btn.dataset.data)
          return get(btnData, style)
            && get(btnData, style) === get(styles, style)
        })
        btn && btn.classList.add('active')
      })
    }
  }
}

customElements.define('toolbar-section', ToolbarSection)

import map from 'lodash/map'
import keys from 'lodash/keys'
import get from 'lodash/get'
import entries from 'lodash/entries'

import {Wp} from '../../core/Wp'
import {updateCurrentStyles} from '../../core/store/actions'
import {buttons} from './config'
import {defaultStyles} from '../table/config'
import {TObj} from '../../core/store/types'

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
        if (toolbarButton.classList.contains('active')) {
          const newStyles = entries(button.data)
              .reduce((acc: Record<string, string>, prop) => {
                if (defaultStyles[prop[0]]) {
                  acc[prop[0]] = defaultStyles[prop[0]]
                } else {
                  acc[prop[0]] = ''
                }
                return acc
              }, {})

          return this.store.dispatch(updateCurrentStyles(newStyles))
        }
        return this.store.dispatch(updateCurrentStyles(button.data))
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
    this.updateButtons(get(
        this.store.state.stylesState,
        get(cell, ['dataset', 'id']),
        defaultStyles,
    ))
  }

  set currentStyles(value: TObj) {
    this.updateButtons(value)
  }

  private updateButtons(newStyles: TObj): void {
    this.buttons.forEach((btn) => btn.classList.remove('active'))
    keys(newStyles).forEach((style) => {
      const btn = this.buttons.find((btn) => {
        const btnData = JSON.parse(btn.dataset.data)
        return get(btnData, style)
          && get(btnData, style) === get(newStyles, style)
      })
      btn && btn.classList.add('active')
    })
  }
}

customElements.define('toolbar-section', ToolbarSection)

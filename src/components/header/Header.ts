import set from 'lodash/set'

import {Wp} from '../../core/Wp'
import {setTableName} from '../../core/store/actions'
import {IEvent} from '../table/types'
import {localStorageManager} from '../../core/LocalStorageManager'

class HeaderSection extends Wp {
  private deleteBtn: HTMLElement
  private exitBtn: HTMLElement
  static get observedAttributes(): Array<string> {
    return ['table-name']
  }

  private input: HTMLInputElement
  constructor() {
    super()
    this.className = 'excel-header'
    this.input = null
    this.deleteBtn = null
    this.exitBtn = null
  }

  set tableName(name: string) {
    set(
        this.input,
        'value',
        name,
    )
  }

  connectedCallback() {
    super.connectedCallback()
    this.input = this.querySelector('.input')
    this.deleteBtn = this.querySelector('.delete-btn')
    this.exitBtn = this.querySelector('.exit-btn')
    this.input.oninput = (evt: IEvent) =>
      this.store.dispatch(setTableName(evt.target.value))
    this.deleteBtn.onclick = () => {
      if (confirm(
          'Are you sure you want to delete this table? There is no way back!'
      )) {
        localStorageManager.removeCurrentTable()
        this.router.navigate()
      }
    }
    this.exitBtn.onclick = () => this.router.navigate()
  }

  get html(): string {
    return `
      <input 
        type="text" 
        class="input" 
        value="${this.store.state.tableName}"
      >
      <div>
        <button class="button delete-btn">
          <span class="material-icons">delete</span>
        </button>
        <button class="button exit-btn">
          <span class="material-icons">exit_to_app</span>
        </button>
      </div>
    `
  }
}

customElements.define('header-section', HeaderSection)

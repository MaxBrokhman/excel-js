import {Wp} from '../../core/Wp'
import {setTableName} from '../../core/action'
import {IEvent} from '../table/types'

class HeaderSection extends Wp {
  static get observedAttributes(): Array<string> {
    return ['table-name']
  }

  private input: HTMLInputElement
  constructor() {
    super()
    this.className = 'excel-header'
    this.input = null
  }

  set tableName(name: string) {
    if (this.input) {
      this.input.value = name
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.input = this.querySelector('.input')
    this.input.oninput = (evt: IEvent) => {
      this.store.dispatch(setTableName(evt.target.value))
    }
  }

  get html(): string {
    return `
      <input 
        type="text" 
        class="input" 
        value="${this.store.state.tableName}"
      >
      <div>
        <button class="button">
          <span class="material-icons">delete</span>
        </button>
        <button class="button">
          <span class="material-icons">exit_to_app</span>
        </button>
      </div>
    `
  }
}

customElements.define('header-section', HeaderSection)

import {Wp} from '../../core/Wp'
import {setCurrentText} from '../../core/action'
import {IEvent} from '../table/types'

export class FormulaField extends Wp {
  static get observedAttributes(): Array<string> {
    return ['current-text']
  }

  public input: HTMLInputElement
  constructor() {
    super()
    this.className = 'excel-formula'
    this.input = null
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.input = this.querySelector('.input')
    this.input.oninput = (evt: IEvent) =>
      this.store.dispatch(setCurrentText(evt.target.value))
    this.onkeydown = (evt: KeyboardEvent) =>
      this.formulaKeydownHandler(evt)
  }

  formulaKeydownHandler(evt: KeyboardEvent): void {
    const keys = ['Enter', 'Tab']
    if (keys.includes(evt.key)) {
      evt.preventDefault()
      this.store.state.currentCell.focus()
    }
  }

  get currentText(): string {
    return this.getAttribute('current-text') || ''
  }

  set currentText(value: string) {
    this.setAttribute('current-text', value)
  }

  attributeChangedCallback(): void {
    if (this.input) this.input.value = this.currentText
  }

  get html(): string {
    return `
      <h2 class="visually-hidden">Excel table formula</h2>
      <label class="caption" for="formula-input">
        fx
      </label>
      <input class="input" id="formula-input">
      </input>
    `
  }
}

customElements.define('formula-field', FormulaField)

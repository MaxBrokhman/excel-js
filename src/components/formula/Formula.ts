import {updater} from '../../core/UpdateObserver'

class FormulaField extends HTMLElement {
  private input: HTMLInputElement
  constructor() {
    super()
    this.className = 'excel-formula'
    this.input = null
  }

  connectedCallback(): void {
    this.innerHTML = this.html
    this.input = this.querySelector('.input')
    this.input.oninput = () => this.inputHandler()
  }

  get html(): string {
    return `
      <h2 class="visually-hidden">Excel table formula</h2>
      <div class="caption">
        fx
      </div>
      <input class="input">
      </input>
    `
  }

  inputHandler(): void {
    updater.dispatch('formula-input', this.input.value.trim())
  }
}

customElements.define('formula-field', FormulaField)

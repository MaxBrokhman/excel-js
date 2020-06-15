import {updater} from '../../core/UpdateObserver'

class FormulaField extends HTMLElement {
  private input: HTMLInputElement
  constructor() {
    super()
    this.className = 'excel-formula'
    this.input = null

    this.cellChange = this.cellChange.bind(this)
  }

  connectedCallback(): void {
    updater.subscribe('cell-change', this.cellChange)
    this.innerHTML = this.html
    this.input = this.querySelector('.input')
    this.input.oninput = () => this.inputHandler()
    this.input.onkeydown = (evt: KeyboardEvent) => this.keydownHandler(evt)
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

  keydownHandler(evt: KeyboardEvent): void {
    const keys = ['Enter', 'Tab']
    if (keys.includes(evt.key)) {
      evt.preventDefault()
      updater.dispatch('formula-done')
    }
  }

  cellChange(content: string) {
    this.input.value = content
  }
}

customElements.define('formula-field', FormulaField)

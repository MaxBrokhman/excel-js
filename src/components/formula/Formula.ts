export class FormulaField extends HTMLElement {
  public input: HTMLInputElement
  constructor() {
    super()
    this.className = 'excel-formula'
    this.input = null
  }

  connectedCallback(): void {
    this.innerHTML = this.html
    this.input = this.querySelector('.input')
    this.input.oninput = (evt: InputEvent) => this.dispatchEvent(evt)
    this.input.onkeydown = (evt: KeyboardEvent) => this.dispatchEvent(evt)
  }

  get inputValue(): string {
    return this.input.value
  }

  set inputValue(value: string) {
    this.input.value = value
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

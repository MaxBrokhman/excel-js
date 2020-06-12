class FormulaField extends HTMLElement {
  constructor() {
    super()
    this.className = 'excel-formula'
  }
  connectedCallback(): void {
    this.innerHTML = this.html
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
}

customElements.define('formula-field', FormulaField)

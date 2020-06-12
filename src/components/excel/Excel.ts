class ExcelTable extends HTMLElement {
  constructor() {
    super()
    this.className = 'excel'
  }

  connectedCallback(): void {
    this.innerHTML = this.html
  }

  get html(): string {
    return `
      <header-section></header-section>
      <toolbar-section></toolbar-section>
      <formula-field></formula-field>
      <table-section></table-section>
    `
  }
}

customElements.define('excel-table', ExcelTable)

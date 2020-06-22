class ToolbarSection extends HTMLElement {
  constructor() {
    super()
    this.className = 'excel-toolbar'
  }

  connectedCallback(): void {
    this.innerHTML = this.html
  }

  get html(): string {
    return `
      <h2 class="visually-hidden">Excel table toolbar</h2>
    `
  }
}

customElements.define('toolbar-section', ToolbarSection)

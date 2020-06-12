class HeaderSection extends HTMLElement {
  constructor() {
    super()
    this.className = 'excel-header'
  }

  connectedCallback() {
    this.innerHTML = this.html
  }

  get html(): string {
    return `
      <input type="text" class="input" value="New table">
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

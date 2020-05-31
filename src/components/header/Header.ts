import {ExcelComponent} from '../../core/ExcelComponent';

export class Header extends ExcelComponent {
  toHTML(): string {
    this.root.innerHTML = `
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
    return this.root.innerHTML
  }
}

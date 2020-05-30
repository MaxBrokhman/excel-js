import {ExcelComponent} from '../../core/ExcelComponent';

export class Header extends ExcelComponent {
  private readonly className = 'excel-header'
  toHTML(): string {
    return `
    <header class="excel-header">
      <input type="text" class="input" value="New table">
      <div>
        <button class="button">
          <span class="material-icons">delete</span>
        </button>
        <button class="button">
          <span class="material-icons">exit_to_app</span>
        </button>
      </div>
    </header>
    `
  }
}

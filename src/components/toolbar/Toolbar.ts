import {ExcelComponent} from '../../core/ExcelComponent';

export class Toolbar extends ExcelComponent {
  private readonly className = 'excel-toolbar'
  toHTML(): string {
    return `
    <section class="excel-toolbar">
      <h2 class="visually-hidden">Excel table toolbar</h2>
      <button class="button" title="align text left">
        <span class="material-icons">format_align_left</span>
      </button>
      <button class="button"  title="align text center">
        <span class="material-icons">format_align_center</span>
      </button>
      <button class="button" title="align text right">
        <span class="material-icons">format_align_right</span>
      </button>
      <button class="button" title="make text bold">
        <span class="material-icons">format_bold</span>
      </button>
      <button class="button" title="make text italic">
        <span class="material-icons">format_italic</span>
      </button>
      <button class="button" title="make text underlined">
        <span class="material-icons">format_underlined</span>
      </button>
    </section>
    `
  }
}

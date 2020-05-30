import {ExcelComponent} from '../../core/ExcelComponent';

export class Formula extends ExcelComponent {
  private readonly className = 'excel-formula'
  toHTML(): string {
    return `
    <section class="excel-formula">
      <h2 class="visually-hidden">Excel table formula</h2>
      <div class="caption">
        fx
      </div>
      <input class="input">

      </input>
    </section>
    `
  }
}

import {ExcelComponent} from '../../core/ExcelComponent';

export class Formula extends ExcelComponent {
  toHTML(): string {
    this.root.innerHTML = `
      <h2 class="visually-hidden">Excel table formula</h2>
      <div class="caption">
        fx
      </div>
      <input class="input">

      </input>
    `
    return this.root.innerHTML
  }
}

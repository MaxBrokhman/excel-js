import {Page} from '../core/Page';

export class ExcelPage extends Page {
  getRoot(): string {
    return `<excel-table></excel-table>`
  }
}

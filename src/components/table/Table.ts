import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './templateCreator';

type TOptions = {
  listeners?: Array<string>,
}

export class Table extends ExcelComponent {
  private readonly className = 'excel-table'
  constructor(root: HTMLElement, options: TOptions = {}) {
    super(root, options.listeners || [])
    this.root = root
    this.root.className = this.className
  }
  toHTML(): string {
    this.root.innerHTML = createTable(15)
    return this.root.outerHTML
  }
}

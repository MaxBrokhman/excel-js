import {
  ID_SEPARATOR,
  MIN_CHAR_CODE,
  MAX_CHAR_CODE,
} from '../../controllers/TableController/config'

export class TableSection extends HTMLElement {
  private readonly rowsCount: number = 15
  private readonly idSeperator: string = ID_SEPARATOR
  private readonly maxCharCode: number = MAX_CHAR_CODE
  private readonly minCharCode: number = MIN_CHAR_CODE
  constructor() {
    super()
    this.className = 'excel-table'
  }

  connectedCallback(): void {
    this.innerHTML = this.html
  }

  get html(): string {
    return `
      <h2 class="visually-hidden">Excel table</h2>
      ${this._renderTable()}
    `
  }

  private _renderCell(col: string, headerContent: number): string {
    return `
      <td 
        class="cell" 
        data-index="${headerContent}" 
        data-col="${col}"
        data-id="${headerContent}${this.idSeperator}${col}"
        contenteditable
      ></td>
    `
  }

  private _renderRow(headerContent: number, colsCount: number): string {
    const cells = []
    for (let i = 0; i < colsCount; i++) {
      cells.push(this._renderCell(
          String.fromCharCode(this.minCharCode + i),
          headerContent
      ))
    }
    return `
      <tr class="row">
        <td 
          class="row-info table-header-cell"
          data-index="${headerContent}"
        >
          <div class="row-resize" data-resize="row"></div>
          ${headerContent}
        </td>
        ${cells.join('')}
      </tr>
    `
  }

  private _renderHeaderCell(headerCell: string): string {
    return `
      <th 
        class="row-data table-header-cell" 
        data-type="resizable" 
        data-col="${headerCell}"
      >
        ${headerCell}
        <div class="col-resize" data-resize="col"></div>
      </th>
    `
  }

  private _renderTable(): string {
    const colsCount = this.maxCharCode - this.minCharCode
    const rows = []
    const headerCells = []
    for (let i = 0; i <= colsCount; i++) {
      headerCells.push(
          this._renderHeaderCell(
              String.fromCharCode(this.minCharCode + i),
          )
      )
    }
    for (let i = 0; i < this.rowsCount; i++) {
      rows.push(this._renderRow(i + 1, colsCount))
    }
    return `
      <table class="table">
        <thead>
          <tr class="row">
            <th class="row-info table-header-cell"></th>
            ${headerCells.join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.join('')}
        </tbody>
      </table>
    `
  }
}

customElements.define('table-section', TableSection)

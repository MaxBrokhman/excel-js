const MIN_CHAR_CODE = 65
const MAX_CHAR_CODE = 90

const getCharByCode = (code: number) => String.fromCharCode(code)

const createCell = (col: string, headerContent: number) => `
  <td class="cell" data-index="${headerContent}" data-col="${col}"></td>
`

const createRow = (headerContent: number, colsCount: number): string => {
  const cells = []
  for (let i = 0; i < colsCount; i++) {
    cells.push(createCell(
        getCharByCode(MIN_CHAR_CODE + i),
        headerContent
    ))
  }
  return `
    <tr class="row">
      <td class="row-info table-header-cell">
        <div class="row-resize" data-resize="row"></div>
        ${headerContent}
      </td>
      ${cells.join('')}
    </tr>
  `
}

const createHeaderCell = (headerCell: string): string => `
  <th 
    class="row-data table-header-cell" 
    data-type="resizable" 
    data-col="${headerCell}"
  >
    ${headerCell}
    <div class="col-resize" data-resize="col"></div>
  </th>
`

export const createTable = (rowsCount: number): string => {
  const colsCount = MAX_CHAR_CODE - MIN_CHAR_CODE
  const rows = []
  const headerCells = []
  for (let i = 0; i <= colsCount; i++) {
    headerCells.push(
        createHeaderCell(
            String.fromCharCode(MIN_CHAR_CODE + i),
        )
    )
  }
  for (let i = 0; i < rowsCount; i++) {
    rows.push(createRow(i + 1, colsCount))
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

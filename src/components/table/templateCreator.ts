const MIN_CHAR_CODE = 65
const MAX_CHAR_CODE = 90

const createCell = () => `
  <td class="cell"></td>
`

const createRow = (headerCell: number, colsCount: number): string => `
  <tr class="row">
    <td class="row-info table-header-cell">${headerCell}</td>
    ${new Array(colsCount).fill(createCell()).join('')}
  </tr>
`

const createHeaderCell = (headerCell: string): string => `
  <th class="row-data table-header-cell">${headerCell}</th>
`

export const createTable = (rowsCount: number): string => {
  const colsCount = MAX_CHAR_CODE - MIN_CHAR_CODE
  const rows = []
  const headerCells = []
  for (let i = 0; i <= colsCount; i++) {
    headerCells.push(
        createHeaderCell(
            String.fromCharCode(MIN_CHAR_CODE + i)
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

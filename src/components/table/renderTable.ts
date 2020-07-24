import set from 'lodash/set'
import keys from 'lodash/keys'
import get from 'lodash/get'

import {TObj} from '../../core/store/types';
import {
  MIN_CHAR_CODE,
  ID_SEPARATOR,
  MAX_CHAR_CODE,
} from '../../core/TableResizer/config';
import {defaultStyles, INITIAL_ROW_COUNT} from './config';
import {
  TRenderCellProps,
  TRenderRowProps,
  TRenderTableProps,
} from './types';

const renderCell = ({
  col,
  content,
  styles,
  colState,
  dataState,
}: TRenderCellProps): string => {
  const td = document.createElement('td')
  td.className = 'cell'
  td.dataset.index = `${content}`
  td.dataset.col = col
  const cellId = `${content}${ID_SEPARATOR}${col}`
  td.dataset.id = cellId
  td.setAttribute('contenteditable', '')
  const storedStyles = get(
      styles,
      cellId,
      defaultStyles,
  )
  keys(storedStyles).forEach((key) => {
    set(
        td.style,
        key,
        get(storedStyles, key),
    )
  })
  if (colState[col]) {
    td.style.width = colState[col]
  }
  const storedContent = dataState[cellId]
  td.textContent = get(storedContent, 'parsed', '')
  return td.outerHTML
}

const renderHeaderCell = (content: string, colState: TObj): string => `
  <th 
    class="row-data table-header-cell" 
    data-type="resizable" 
    data-col="${content}"
    ${colState[content]
        ? `style="width: ${colState[content]};"`
        : '' }
  >
    ${content}
    <div class="col-resize" data-resize="col"></div>
  </th>
`

const renderRow = ({
  content,
  colsCount,
  rowState,
  dataState,
  colState,
  styles,
}: TRenderRowProps) => {
  const cells = []
  for (let i = 0; i < colsCount; i++) {
    cells.push(renderCell({
      col: String.fromCharCode(MIN_CHAR_CODE + i),
      content,
      dataState,
      colState,
      styles,
    }))
  }
  return `
    <tr 
      class="row" 
      data-index="${content}"
      ${rowState[content]
        ? `style="height: ${rowState[content]}"`
        : ''}
    >
      <td 
        class="row-info table-header-cell"
        data-index="${content}"
      >
        <div class="row-resize" data-resize="row"></div>
        ${content}
      </td>
      ${cells.join('')}
    </tr>
  `
}

export const renderTable = ({
  colState,
  dataState,
  rowState,
  styles,
}: TRenderTableProps): string => {
  const colsCount = MAX_CHAR_CODE - MIN_CHAR_CODE
  const rows = []
  const headerCells = []
  for (let i = 0; i <= colsCount; i++) {
    headerCells.push(
        renderHeaderCell(
            String.fromCharCode(MIN_CHAR_CODE + i),
            colState,
        )
    )
  }
  for (let i = 0; i < INITIAL_ROW_COUNT; i++) {
    rows.push(renderRow({
      content: String(i + 1),
      colsCount,
      colState,
      dataState,
      rowState,
      styles,
    }))
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

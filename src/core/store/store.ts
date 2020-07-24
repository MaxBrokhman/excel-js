import {defaultStyles} from '../../components/table/config'
import {defaultTableName} from '../config'
import {TState} from './types'

export const initialState: TState = {
  rowState: {},
  tableName: defaultTableName,
  colState: {},
  dataState: {},
  stylesState: {},
  currentText: {
    value: '',
    parsed: '',
  },
  currentStyles: {
    ...defaultStyles,
  },
  selectedCells: [],
  currentCell: null,
  openDate: new Date().toJSON(),
}

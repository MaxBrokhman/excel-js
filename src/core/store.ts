import {defaultStyles} from '../components/table/config';
import {defaultTableName} from './config';

export type TCurrentText = {
  value?: string,
  parsed?: string,
}

export type TState = {
  tableName: string,
  rowState: Record<string, string>,
  colState: Record<string, string>,
  dataState: Record<string, string>,
  stylesState: Record<string, string>,
  currentText: TCurrentText,
  currentStyles: Record<string, string>,
  selectedCells: Array<HTMLElement>,
  currentCell: HTMLElement,
  openDate: string,
}

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

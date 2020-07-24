import {defaultStyles} from '../components/table/config';
import {defaultTableName} from './config';

export type TCurrentText = {
  value?: string,
  parsed?: string,
}

export type TObj = {
  [key: string]: string,
}

export type TDeepObj = {
  [key: string]: TObj,
}

type TContent = {
  value: string,
  parsed: string,
}

export type TDataState = {
  [key: string]: TContent,
}

export type TState = {
  tableName: string,
  rowState: TObj,
  colState: TObj,
  dataState: TDataState,
  stylesState: TDeepObj,
  currentText: TCurrentText,
  currentStyles: TObj,
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

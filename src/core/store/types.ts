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

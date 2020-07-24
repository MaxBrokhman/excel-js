import {
  TObj,
  TDeepObj,
  TDataState,
} from '../../core/store/types'

export interface IEvent extends MouseEvent {
  target: ITarget,
}

interface ITarget extends HTMLElement {
  closest: (selector: string) => HTMLElement,
  dataset: {
    resize?: string,
    id?: string,
  },
  value?: string,
}

export type TRenderCellProps = {
  col: string,
  content: string,
  styles: TDeepObj,
  colState: TObj,
  dataState: TDataState,
}

export type TRenderRowProps = {
  content: string,
  colsCount: number,
  rowState: TObj,
  dataState: TDataState,
  styles: TDeepObj,
  colState: TObj,
}

export type TRenderTableProps = {
  rowState: TObj,
  dataState: TDataState,
  styles: TDeepObj,
  colState: TObj,
}

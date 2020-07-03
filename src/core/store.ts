import {StoreManager} from './StoreManager';
import {LocalStorageManager} from './LocalStorageManager';

export type TState = {
  rowState: Record<string, string>,
  colState: Record<string, string>,
  dataState: Record<string, string>,
  stylesState: Record<string, string>,
  currentText: string,
  currentStyles: Record<string, string>,
  selectedCells: Array<HTMLElement>,
  currentCell: HTMLElement,
}

const initialState: TState = {
  rowState: {},
  colState: {},
  dataState: {},
  stylesState: {},
  currentText: '',
  currentStyles: {},
  selectedCells: [],
  currentCell: null,
}

export const store = new StoreManager(initialState, new LocalStorageManager());

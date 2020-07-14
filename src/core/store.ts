import {StoreManager} from './StoreManager';
import {LocalStorageManager} from './LocalStorageManager';
import {defaultStyles} from '../components/table/config';
import {defaultTableName} from './config';

export type TState = {
  tableName: string,
  rowState: Record<string, string>,
  colState: Record<string, string>,
  dataState: Record<string, string>,
  stylesState: Record<string, string>,
  currentText: string,
  currentStyles: Record<string, string>,
  selectedCells: Array<HTMLElement>,
  currentCell: HTMLElement,
}

const localStorageManager = new LocalStorageManager()

const persistedState: TState = localStorageManager.getValue('state')

const initialState: TState = {
  rowState: {},
  tableName: defaultTableName,
  colState: {},
  dataState: {},
  stylesState: {},
  currentText: '',
  currentStyles: {
    ...defaultStyles,
  },
  selectedCells: [],
  currentCell: null,
}

export const store = new StoreManager(
    persistedState || initialState,
    localStorageManager,
)

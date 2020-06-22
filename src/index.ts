import './scss/index.scss'
import './components/excel/Excel'
import './components/formula/Formula'
import './components/header/Header'
import './components/toolbar/Toolbar'
import './components/table/Table'
import {App} from './core/App'
import {TableController} from './controllers/TableController/TableController'
import {TableSelection} from './components/table/TableSelection'
import {updater} from './core/UpdateObserver'
import {
  FormulaController,
} from './controllers/FormulaController/FormulaController'
import {localStorageManager} from './core/LocalStorageManager'
import {
  ToolbarController,
} from './controllers/ToolbarController/ToolbarController'

const selection = new TableSelection()

const root = document.querySelector('excel-table')
const app = new App([
  new TableController({
    selection,
    table: root.querySelector('table-section'),
    updater,
    storage: localStorageManager,
  }),
  new FormulaController({
    formula: root.querySelector('formula-field'),
    updater,
  }),
  new ToolbarController({
    toolbar: root.querySelector('toolbar-section'),
    selection,
    storage: localStorageManager,
    updater,
  }),
])
app.init()

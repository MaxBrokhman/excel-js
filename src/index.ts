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

const root = document.querySelector('excel-table')
const app = new App([
  new TableController({
    selection: new TableSelection(),
    table: root.querySelector('table-section'),
    updater,
    storage: localStorageManager,
  }),
  new FormulaController({
    formula: root.querySelector('formula-field'),
    updater,
  }),
])
app.init()

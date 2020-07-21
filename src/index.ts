import {App} from './core/App'

import './scss/index.scss'
import './components/excel/Excel'
import './components/formula/Formula'
import './components/header/Header'
import './components/toolbar/Toolbar'
import './components/table/Table'
import {Router} from './core/Router'
import {DashboardPage} from './pages/DashboardPage'
import {ExcelPage} from './pages/ExcelPage'

new Router('#app', {
  dashboard: DashboardPage,
  excel: ExcelPage,
})

const app = new App([])
app.init()

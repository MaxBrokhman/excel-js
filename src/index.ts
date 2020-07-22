import {App} from './core/App'

import './scss/index.scss'
import './components/excel/Excel'
import './components/formula/Formula'
import './components/header/Header'
import './components/toolbar/Toolbar'
import './components/table/Table'
import './components/dashboard/Dashboard'

export const app = new App([])
app.init()

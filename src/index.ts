import {Excel} from './components/excel/Excel'

import './scss/index.scss'
import {Header} from './components/header/Header'
import {Table} from './components/table/Table'
import {Formula} from './components/formula/Formula'
import {Toolbar} from './components/toolbar/Toolbar'


const excel = new Excel('#app', {
  components: [
    new Header(document.createElement('header')),
    new Toolbar(document.createElement('section')),
    new Formula(document.createElement('section')),
    new Table(document.createElement('section')),
  ],
})

excel.render()

import {Excel} from './components/excel/Excel'

import './scss/index.scss'
import {Header} from './components/header/Header'
import {Table} from './components/table/Table'
import {Formula} from './components/formula/Formula'
import {Toolbar} from './components/toolbar/Toolbar'


const excel = new Excel('#app', {
  components: [
    new Header({
      root: document.createElement('header'),
      className: 'excel-header',
    }),
    new Toolbar({
      root: document.createElement('section'),
      className: 'excel-toolbar',
    }),
    new Formula({
      root: document.createElement('section'),
      className: 'excel-formula',
    }),
    new Table({
      root: document.createElement('section'),
      options: {
        listeners: ['mousedown'],
      },
      className: 'excel-table',
    }),
  ],
})

excel.render()

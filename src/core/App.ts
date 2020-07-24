import get from 'lodash/get'

import {localStorageManager} from './LocalStorageManager'
import {initialState} from './store/store'
import {StoreManager} from './store/StoreManager'
import {Router} from './Router'
import {TState} from './store/types'

export class App {
  public router: Router
  private root: HTMLElement
  public store: StoreManager
  constructor() {
    this.router = new Router({
      dashboard: '<dash-board></dash-board>',
      excel: `<excel-table></excel-table>`,
    })
    this.root = document.querySelector('#app')
    this.changePageHandler = this.changePageHandler.bind(this)
  }

  public init(): void {
    window.addEventListener('hashchange', this.changePageHandler)
    this.changePageHandler()
  }

  changePageHandler(): void {
    this.store = this.initStore()
    this.root.innerHTML = this.router.activeRoute
  }

  initState(table: string): TState {
    localStorageManager.currentTableId = table
    const storedState = localStorageManager.getTableRecord()
    return storedState || initialState
  }

  initStore(): StoreManager {
    const tableId = get(this.router, ['param', 'length'])
      ? this.router.param
      : `${new Date().getTime()}`

    return new StoreManager(
        this.initState(tableId),
        localStorageManager,
    )
  }
}

import {localStorageManager} from './LocalStorageManager'
import {initialState} from './store'
import {StoreManager} from './StoreManager'
import {Router} from './Router'
import {DashboardPage} from '../pages/DashboardPage'
import {ExcelPage} from '../pages/ExcelPage'

interface IController {
  init: () => void,
}

export class App {
  private controllers: Array<IController>
  private router: Router
  private root: HTMLElement
  public store: any
  constructor(controllers: Array<IController>) {
    this.controllers = controllers
    this.router = new Router({
      dashboard: DashboardPage,
      excel: ExcelPage,
    })
    this.root = document.querySelector('#app')
    this.changePageHandler = this.changePageHandler.bind(this)
  }

  public init(): void {
    this.controllers.forEach((controller) => controller.init())
    window.addEventListener('hashchange', this.changePageHandler)
    this.changePageHandler()
  }

  changePageHandler(): void {
    this.store = this.initStore()
    this.root.innerHTML = this.router.activeRoute
  }

  initState(table: string): any {
    localStorageManager.currentTableId = table
    const storedState = localStorageManager.getTableRecord()
    return storedState || initialState
  }

  initStore(): StoreManager {
    const tableId = this.router.param && this.router.param.length
      ? this.router.param
      : `${new Date().getTime()}`

    return new StoreManager(
        this.initState(tableId),
        localStorageManager,
    )
  }
}

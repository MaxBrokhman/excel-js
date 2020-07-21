export class Router {
  private placeholder: HTMLElement
  public routes: Record<string, any>
  constructor(selector: string, routes: Record<string, any>) {
    this.placeholder = document.querySelector(selector)
    this.routes = routes
    this.changePageHandler = this.changePageHandler.bind(this)

    this.init()
  }

  init(): void {
    window.addEventListener('hashchange', this.changePageHandler)
    this.changePageHandler()
  }

  changePageHandler(): void {
    console.log(this.path)
    const NewPage = this.routes[this.path]
    if (NewPage) {
      const page = new NewPage()
      this.placeholder.insertAdjacentHTML('beforeend', page.getRoot())
    }
  }

  get path(): string {
    return window.location.hash.slice(1)
  }

  get param(): string {
    return this.path.split('/')[1]
  }

  destroy(): void {
    window.removeEventListener('hashchange', this.changePageHandler)
  }
}

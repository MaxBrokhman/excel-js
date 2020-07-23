export class Router {
  public routes: Record<string, any>
  constructor(routes: Record<string, any>) {
    this.routes = routes
  }

  get path(): string {
    return window.location.hash.slice(1)
  }

  get location(): string {
    return this.path.split('/')[0]
  }

  get param(): string {
    return this.path.split('/')[1]
  }

  get activeRoute(): string {
    const NewPage = this.routes[this.location]
    if (NewPage) {
      return new NewPage().getRoot()
    }
    const DefaultPage = this.routes.dashboard
    return new DefaultPage().getRoot()
  }

  navigateToMain(): void {
    window.location.hash = ''
  }
}

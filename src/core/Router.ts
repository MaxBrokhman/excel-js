import get from 'lodash/get'

export class Router {
  public routes: Record<string, string>
  constructor(routes: Record<string, string>) {
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
    const page = get(this.routes, this.location)
    return page || this.routes.dashboard
  }

  navigate(path = ''): void {
    window.location.hash = path
  }
}

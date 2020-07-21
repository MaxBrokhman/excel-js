export class ActiveRoute {
  static get path(): string {
    return window.location.hash
  }

  static get param(): string {
    return ActiveRoute.path.split('/')[1]
  }
}

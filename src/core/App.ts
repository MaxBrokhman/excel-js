interface IController {
  init: () => void,
}

export class App {
  private controllers: Array<IController>
  constructor(controllers: Array<IController>) {
    this.controllers = controllers
  }

  public init(): void {
    this.controllers.forEach((controller) => controller.init())
  }
}

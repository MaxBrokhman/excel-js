import {ExcelComponent} from '../../core/ExcelComponent';

export type TOptions = {
  components: Array<ExcelComponent>,
}

export class Excel {
  private element: HTMLElement;
  private components: Array<ExcelComponent>;
  private readonly rootClassName = 'excel'
  constructor(selector: string, options: TOptions) {
    this.element = document.querySelector(selector)
    this.components = options.components || []
  }

  getRoot(): HTMLElement {
    const root = document.createElement('div')
    root.classList.add(this.rootClassName)
    this.components.forEach((component) => {
      component.toHTML()
      root.appendChild(component.root)
    })
    return root
  }

  render(): void {
    this.components.forEach((component) => component.init())
    this.element.append(this.getRoot())
  }
}

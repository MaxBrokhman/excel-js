type TOptions = {
  listeners?: Array<string>,
}

export interface IEvent extends MouseEvent {
  target: ITarget,
}

interface ITarget extends HTMLElement {
  closest: (selector: string) => HTMLElement,
  dataset: {
    resize?: string,
  }
}

export type TProps = {
  root: HTMLElement,
  options: TOptions,
  className: string,
}

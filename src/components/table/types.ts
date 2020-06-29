export interface IEvent extends MouseEvent {
  target: ITarget,
}

interface ITarget extends HTMLElement {
  closest: (selector: string) => HTMLElement,
  dataset: {
    resize?: string,
    id?: string,
  },
  value?: string,
}

export class Page {
  private params: any
  constructor(params: any) {
    this.params = params
  }

  getRoot(): string {
    return ''
  }

  destroy(): void {
    console.log('destroy')
  }
}

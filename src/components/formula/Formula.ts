import {Wp} from '../../core/Wp'
import {setCurrentText, updateContent} from '../../core/store/actions'
import {IEvent} from '../table/types'
import {TCurrentText} from '../../core/store/types'

export class FormulaField extends Wp {
  private _currentText: TCurrentText
  static get observedAttributes(): Array<string> {
    return ['current-text']
  }

  public input: HTMLInputElement
  constructor() {
    super()
    this.className = 'excel-formula'
    this.input = null
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.input = this.querySelector('.input')
    this.input.oninput = (evt: IEvent) => this.inputHandler(evt)
    this.onkeydown = (evt: KeyboardEvent) => this.formulaKeydownHandler(evt)
  }

  formulaKeydownHandler(evt: KeyboardEvent): void {
    const keys = ['Enter', 'Tab']
    if (keys.includes(evt.key)) {
      evt.preventDefault()
      this.store.state.currentCell.focus()
    }
  }

  inputHandler(evt: IEvent): void {
    this.store.dispatch(setCurrentText(evt.target.value))
    this.store.state.selectedCells.forEach((cell: HTMLElement) => {
      this.store.dispatch(
          updateContent(cell.dataset.id, evt.target.value)
      )
    })
  }

  get currentText(): TCurrentText {
    return this._currentText
  }

  set currentText(value: TCurrentText) {
    if (this.input) {
      this.input.value = value.value
    }
    this._currentText = value
  }

  get html(): string {
    return `
      <h2 class="visually-hidden">Excel table formula</h2>
      <label class="caption" for="formula-input">
        fx
      </label>
      <input class="input" id="formula-input">
      </input>
    `
  }
}

customElements.define('formula-field', FormulaField)

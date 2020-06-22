import {UpdateObserver} from '../../core/UpdateObserver';
import {FormulaField} from '../../components/formula/Formula'

type TFormulaConstructor = {
  formula: FormulaField,
  updater: UpdateObserver,
}

export class FormulaController {
  private formula: FormulaField
  private updater: UpdateObserver
  constructor({
    formula,
    updater,
  }: TFormulaConstructor) {
    this.formula = formula
    this.updater = updater

    this.cellChangeHandler = this.cellChangeHandler.bind(this)
    this.updater.subscribe('cell-change', this.cellChangeHandler)
  }

  init(): void {
    this.formula.oninput = () => this.formulaInputHandler()
    this.formula.onkeydown = (evt: KeyboardEvent) =>
      this.formulaKeydownHandler(evt)
  }

  cellChangeHandler(content: string):void {
    this.formula.inputValue = content
  }

  formulaInputHandler(): void {
    this.updater.dispatch('formula-input', this.formula.inputValue.trim())
  }

  formulaKeydownHandler(evt: KeyboardEvent): void {
    const keys = ['Enter', 'Tab']
    if (keys.includes(evt.key)) {
      evt.preventDefault()
      this.updater.dispatch('formula-done')
    }
  }
}

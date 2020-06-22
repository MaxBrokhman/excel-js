import {UpdateObserver} from '../../core/UpdateObserver'
import {LocalStorageManager} from '../../core/LocalStorageManager'
import {TButton, TProps} from './types'
import {TableSelection} from '../../components/table/TableSelection'

export class ToolbarController {
  static get buttons(): Array<TButton> {
    return [{
      data: {['text-align']: 'left'},
      icon: 'format_align_left',
      title: 'align text left',
    }, {
      data: {['text-align']: 'center'},
      icon: 'format_align_center',
      title: 'align text center',
    }, {
      data: {['text-align']: 'right'},
      icon: 'format_align_right',
      title: 'align text right',
    }, {
      data: {['font-weight']: 'bold'},
      icon: 'format_bold',
      title: 'make text bold',
    }, {
      data: {['font-style']: 'italic'},
      icon: 'format_italic',
      title: 'make text italic',
    }, {
      data: {['text-decoration']: 'underline'},
      icon: 'format_underlined',
      title: 'make text underlined',
    }]
  }
  private toolbar: HTMLElement
  private updater: UpdateObserver
  private storage: LocalStorageManager
  private selection: TableSelection
  constructor({
    storage,
    toolbar,
    updater,
    selection,
  }: TProps) {
    this.toolbar = toolbar
    this.updater = updater
    this.storage = storage
    this.selection = selection
  }

  createButton({icon, title}: TButton): HTMLElement {
    const button = document.createElement('button')
    button.className = 'button'
    button.setAttribute('title', title)
    button.innerHTML = `<span class="material-icons">${icon}</span>`
    return button
  }

  init(): void {
    ToolbarController.buttons.forEach((button) => {
      const toolbarButton = this.createButton(button)
      toolbarButton.onclick = () => {
        this.selection.group.forEach((cell) => {
          Object.keys(button.data).forEach((key) => {
            if (cell.style.getPropertyValue(key) === button.data[key]) {
              cell.style.setProperty(key, '')
            } else {
              cell.style.setProperty(key, button.data[key])
            }
          })
        })
      }
      this.toolbar.appendChild(toolbarButton)
    })
  }
}

import {UpdateObserver} from '../../core/UpdateObserver'
import {LocalStorageManager} from '../../core/LocalStorageManager'
import {TableSelection} from '../../components/table/TableSelection'

export type TButton = {
  icon: string,
  title: string,
  data: Record<string, string>,
}

export type TProps = {
  toolbar: HTMLElement,
  updater: UpdateObserver,
  storage: LocalStorageManager,
  selection: TableSelection,
}

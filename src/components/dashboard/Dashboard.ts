import map from 'lodash/map'

import {Wp} from '../../core/Wp';
import {localStorageManager} from '../../core/LocalStorageManager';

class Dashboard extends Wp {
  private tableRecords: Array<string>
  constructor() {
    super()
    this.tableRecords = localStorageManager.getAllTableRecords()
  }

  get dashboardHeader(): string {
    return `
      <div class="dashboard__header">
        <h1>Excel Dashboard</h1>
      </div>
      <div class="dashboard__new">
        <div class="dashboard__view">
          <a href="#excel" class="dashboard__create">New table</a>
        </div>
      </div>
    `
  }

  get html(): string {
    return `
      <div class="dashboard">
        ${this.dashboardHeader}
        <div class="dashboard__list-container dashboard__view">
          ${this.tableRecordsList}
        </div>
      </div>
    `
  }

  get tableRecordsList(): string {
    return this.tableRecords.length
      ? `
        <div class="dashboard__list-header">
          <span>Table name</span>
          <span>Opening date</span>
        </div>
        
        <ul class="dashboard__list">
        ${map(this.tableRecords, (key) => {
        const record = localStorageManager.getTableRecord(key)

        return `
          <li class="dashboard__record">
            <a href="#excel/${key}">
              ${record.tableName}
            </a>
            <strong>
              ${new Date(record.openDate).toLocaleDateString()}
              ${new Date(record.openDate).toLocaleTimeString()}
            </strong>
          </li>
          `
      })
          .join('')}
        </ul>
      `
      : '<p>You did\'nt create any tables yet</p>'
  }
}

customElements.define('dash-board', Dashboard)

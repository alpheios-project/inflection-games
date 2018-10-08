export default class GameTable {
  uploadTable (view) {
    if (!view.hasPrerenderedTables) {
      return this.uploadTableFromWideView(view)
    } else {
      return this.uploadTableFromWideTable(view)
    }
  }

  uploadTableFromWideTable (view) {
    let rows = []
    if (view.wideTable) {
      view.wideTable.rows.forEach(row => {
        let cells = []
        row.cells.forEach(cell => {
          let gameCell = Object.assign({}, cell)
          gameCell.tableType = 'wideTable'
          gameCell.isDataCell = cell.role === 'data'
          gameCell.fullMatch = gameCell.isDataCell ? cell.fullMatch : false
          gameCell.gameHidden = gameCell.isDataCell
          gameCell.value = cell.value
          gameCell.features = {}
          gameCell.classes = this.getClassesForCellWideTable(cell)

          Object.keys(cell).filter(key => ['role', 'value', 'fullMatch'].indexOf(key) === -1).forEach(key => {
            gameCell.features[key] = cell[key]
          })

          cells.push(gameCell)
        })
        rows.push({ cells: cells, classes: 'infl-prdgm-tbl__row' })
      })
    }
    this.tableClasses = 'infl-prdgm-tbl'
    this.rows = rows
  }

  uploadTableFromWideView (view) {
    let rows = []
    if (view.wideView) {
      view.wideView.rows.forEach(row => {
        let cells = []
        row.cells.filter(cell => cell.hidden === undefined || cell.hidden === false).forEach(cell => {
          let gameCell = Object.assign({}, cell)
          gameCell.tableType = 'wideView'
          gameCell.isDataCell = cell.isDataCell ? cell.isDataCell : false
          gameCell.fullMatch = cell.isDataCell && cell.morphemes.some(morpheme => morpheme.match.fullMatch)
          gameCell.gameHidden = cell.isDataCell
          gameCell.value = !cell.isDataCell ? cell.value : cell.morphemes.map(morpheme => morpheme.value).join(', ')
          gameCell.morphemes = cell.isDataCell ? cell.morphemes : []
          gameCell.features = {}
          gameCell.classes = this.getClassesForCellWideView(cell)
          if (cell.features && Array.isArray(cell.features)) {
            cell.features.forEach(feature => { gameCell.features[feature.type] = feature.value })
          }
          cells.push(gameCell)
        })
        rows.push({ cells: cells })
      })
    }
    this.tableClasses = 'infl-table infl-table--wide'
    this.rows = rows
  }

  getClassesForCellWideTable (cell) {
    let classes = {'infl-prdgm-tbl__cell': true}

    if (cell.role === 'label') {
      classes['infl-prdgm-tbl-cell--label'] = true
    }

    if (cell.role === 'data') {
      classes['infl-prdgm-tbl-cell--data'] = true
    }

    return classes
  }

  getClassesForCellWideView (cell) {
    let classes = {'infl-cell': true}

    if (cell.constructor.name === 'HeaderCell') {
      classes['infl-cell--hdr'] = true
      classes[`infl-cell--sp${cell.span}`] = true
    }

    if (cell.constructor.name === 'RowTitleCell') {
      classes['row-title-cell'] = true
      classes['infl-cell--hdr'] = cell.formsColumn
      if (cell.fullWidth) {
        classes['infl-cell--fw'] = true
      } else {
        classes[`infl-cell--sp${cell.span}`] = true
      }
    }

    return classes
  }

  clearValuesStatus () {
    if (this.rows) {
      this.rows.forEach(row => {
        row.cells.forEach(cell => {
          cell.gameHidden = cell.isDataCell
        })
      })
    }
  }

  checkFailedFeature (featureName, featureValue) {
    this.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.isDataCell && (cell.features[featureName] === featureValue)) {
          cell.gameHidden = false
        }
      })
    })
  }

  checkSuccessFeature (featureName, featureValue, featureListByName) {
    this.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.isDataCell && !featureListByName.find(feat => feat.value === cell.features[featureName]).hasFullMatch && (cell.features[featureName] !== featureValue)) {
          cell.gameHidden = false
        }
      })
    })
  }

  get isOnlyFullMatchUncovered () {
    return this.rows.every(row =>
      row.cells.filter(cell => cell.isDataCell && !cell.fullMatch).every(cell => !cell.gameHidden)
    )
  }

  showAllCells () {
    this.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.isDataCell) { cell.gameHidden = false }
      })
    })
  }
}

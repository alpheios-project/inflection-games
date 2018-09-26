export default class GameTable {
  constructor (view) {
    this.uploadTable(view)
  }

  uploadTable (view) {
    let rows = []
    if (view.wideView) {
      view.wideView.rows.forEach(row => {
        let cells = []
        row.cells.filter(cell => !cell.classes['infl-cell--sp0'] && !cell.classes['hidden']).forEach(cell => {
          let gameCell = Object.assign({}, cell)
          gameCell.isDataCell = cell.isDataCell ? cell.isDataCell : false
          gameCell.fullMatch = cell.isDataCell && cell.suffixMatches
          gameCell.gameHidden = cell.isDataCell
          gameCell.value = !cell.isDataCell ? cell.value : cell.morphemes.map(morpheme => morpheme.value).join(', ')
          cells.push(gameCell)
        })
        rows.push({ cells: cells })
      })
    }

    this.rows = rows
  }

  clearValuesStatus () {
    if (this.rows) {
      this.rows.forEach(row => {
        row.cells.forEach(cell => {
          cell.hidden = cell.isDataCell
        })
      })
    }
  }

  checkFailedFeature (featureName, featureValue) {
    this.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.isDataCell && !cell.fullMatch && cell.features.some(feature => feature.type === featureName && feature.value !== featureValue)) {
          cell.gameHidden = false
        }
      })
    })
  }

  checkSuccessFeature (featureName, featureValue) {
    this.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.isDataCell && !cell.fullMatch && cell.features.some(feature => feature.type === featureName && feature.value !== featureValue)) {
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
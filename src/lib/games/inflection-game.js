import Game from '@/lib/game'

export default class InflectionGame extends Game {
  constructor (view) {
    super(view)
    this.view = view
    this.createGameStuff()
  }

  createGameStuff () {
    let gameTable = { rows: [] }
    let featuresList = {}

    this.view.wideTable.rows.forEach(row => {
      let cells = []
      row.cells.forEach(cell => {
        cell.fullMatch = cell.role === 'data' ? InflectionGame.compareLexemesToCell(this.view.inflectionData, cell) : null
        cell.hidden = cell.role === 'data'
        cells.push(Object.assign({}, cell))

        this.updateFeaturesList(cell, featuresList)
      })
      gameTable.rows.push({ cells: cells })
    })

    this.gameTable = gameTable
    this.featuresList = featuresList
  }

  clearGameStuff () {
    if (this.gameTable && this.gameTable.rows) {
      this.gameTable.rows.forEach(row => {
        row.cells.forEach(cell => {
          cell.hidden = cell.role === 'data'
        })
      })
    }
    if (this.featuresList) {
      Object.values(this.featuresList).forEach(featureValues => {
        featureValues.forEach(featVal => { featVal.status = null })
      })
    }
  }

  updateFeaturesList (cell, featuresList) {
    if (cell.role === 'data') {
      let cellFeatures = InflectionGame.getFeatures(cell)

      cellFeatures.forEach(feature => {
        if (featuresList[feature] === undefined) {
          featuresList[feature] = []
        }

        if (!featuresList[feature].find(item => item.value === cell[feature])) {
          featuresList[feature].push(
            {
              value: cell[feature],
              status: null
            }
          )
        }
      })
    }
  }

  featureHasFullMatch (featureName, featureValue) {
    return this.gameTable.rows.some(row => row.cells.some(cell => {
      return cell.fullMatch && cell[featureName] === featureValue.value
    }))
  }

  get featuresListTitles () {
    return Object.keys(this.featuresList).filter(key => this.featuresList[key].length > 1)
  }

  get gameType () {
    return 'Guess inflection'
  }

  static getFeatures (cell) {
    let ignoreCellProps = ['role', 'value', 'fullMatch', 'hidden']
    return Object.keys(cell).filter(prop => ignoreCellProps.indexOf(prop) === -1)
  }

  static compareLexemesToCell (inflectionData, cell) {
    let cellFeatures = InflectionGame.getFeatures(cell)

    return inflectionData.homonym.lexemes.some(lexeme =>
      lexeme.inflections.some(inflection =>
        cellFeatures.every(feature => inflection.hasOwnProperty(feature) && inflection[feature].value === cell[feature])
      )
    )
  }

  static findFullMatchInView (view) {
    return view.wideTable.rows.some(row =>
      row.cells.some(cell => (cell.role === 'data') && InflectionGame.compareLexemesToCell(view.inflectionData, cell))
    )
  }

  static matchViewsCheck (view) {
    return view.hasComponentData && InflectionGame.findFullMatchInView(view)
  }
}

import Game from '@/lib/game'

export default class InflectionGame extends Game {
  constructor (view) {
    super(view)
    this.view = view
    this.createGameStuff()
  }

  createGameStuff () {
    let gameTable = { rows: [] }
    let featuresList = this.updateFeaturesList()

    this.view.wideView.rows.forEach(row => {
      let cells = []
      row.cells.filter(cell => !cell.classes['infl-cell--sp0'] && !cell.classes['hidden']).forEach(cell => {
        let gameCell = Object.assign({}, cell)
        gameCell.isDataCell = cell.isDataCell
        gameCell.fullMatch = cell.isDataCell && cell.suffixMatches
        gameCell.gameHidden = cell.isDataCell
        gameCell.value = !cell.isDataCell ? cell.value : cell.morphemes.map(morpheme => morpheme.value).join(', ')
        console.info('*****************gameCell', gameCell, cell)
        cells.push(gameCell)

        // this.updateFeaturesList(cell, featuresList)
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
          cell.hidden = cell.isDataCell
        })
      })
    }
    if (this.featuresList) {
      Object.values(this.featuresList).forEach(featureValues => {
        featureValues.forEach(featVal => { featVal.status = null })
      })
    }
  }

  updateFeaturesList () {
    let featuresList = {}
    Object.keys(this.view.features).forEach(featureKey => {
      featuresList[this.view.features[featureKey].type] = Array.from(this.view.features[featureKey].featureMap.keys()).map(featureValue => {
        return {
          value: featureValue,
          status: null
        }
      })
    })
    return featuresList
  }

  featureHasFullMatch (featureName, featureValue) {
    return this.gameTable.rows.some(row => row.cells.some(cell =>
      cell.isDataCell && cell.fullMatch && cell.features.some(feature => feature.type === featureName && feature.value === featureValue.value)
    ))
  }

  get featuresListTitles () {
    return Object.keys(this.featuresList).filter(key => this.featuresList[key].length > 1)
  }

  get gameType () {
    return 'Guess inflection'
  }

  static getFeatures (cell) {
    // let ignoreCellProps = ['role', 'value', 'fullMatch', 'hidden']
    return cell.features.map(feature => feature.type) // Object.keys(cell).filter(prop => ignoreCellProps.indexOf(prop) === -1)
  }

  // static compareLexemesToCell (inflectionData, cell) {
  //   let cellFeatures = InflectionGame.getFeatures(cell)

  //   return inflectionData.homonym.lexemes.some(lexeme =>
  //     lexeme.inflections.some(inflection =>
  //       cellFeatures.every(feature => inflection.hasOwnProperty(feature) && inflection[feature].value === cell[feature])
  //     )
  //   )
  // }

  static findFullMatchInView (view) {
    // return view.wideView.rows.some(row =>
    //   row.cells.some(cell => cell.isDataCell && cell.suffixMatches)
    // )
    return view.morphemes.some(morpheme => morpheme.match.fullMatch)
  }

  static checkViewFormatCorrect (view) {
    return !view.hasPrerenderedTables && view.isImplemented && view.wideView && !view.isEmpty
  }

  static matchViewsCheck (view) {
    view.render()
    console.info('**************matchViewsCheck1', InflectionGame.checkViewFormatCorrect(view))
    console.info('**************matchViewsCheck2', InflectionGame.findFullMatchInView(view))
    return InflectionGame.checkViewFormatCorrect(view) && InflectionGame.findFullMatchInView(view)
  }
}

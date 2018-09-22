import Game from '@/lib/game'

export default class InflectionGame extends Game {
  constructor (view) {
    super(view)
    this.view = view
  }

  createGameStuff () {
    let gameTable = { rows: [] }
    let featuresList = this.updateFeaturesList()
    this.render()

    if (this.view.wideView) {
      this.view.wideView.rows.forEach(row => {
        let cells = []
        row.cells.filter(cell => !cell.classes['infl-cell--sp0'] && !cell.classes['hidden']).forEach(cell => {
          let gameCell = Object.assign({}, cell)
          gameCell.isDataCell = cell.isDataCell ? cell.isDataCell : false
          gameCell.fullMatch = cell.isDataCell && cell.suffixMatches
          gameCell.gameHidden = cell.isDataCell
          gameCell.value = !cell.isDataCell ? cell.value : cell.morphemes.map(morpheme => morpheme.value).join(', ')
          cells.push(gameCell)
        })
        gameTable.rows.push({ cells: cells })
      })
    }
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

  static get gameType () {
    return 'Guess inflection'
  }

  static getFeatures (cell) {
    return cell.features.map(feature => feature.type)
  }

  findFullMatchInView () {
    return this.view.morphemes.some(morpheme => morpheme.match.fullMatch)
  }

  checkViewFormatCorrect () {
    return !this.view.hasPrerenderedTables && this.view.isImplemented
  }

  matchViewsCheck () {
    this.prerender()
    return this.checkViewFormatCorrect() && this.findFullMatchInView()
  }
}

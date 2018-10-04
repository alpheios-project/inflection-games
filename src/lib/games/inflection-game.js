import Game from '@/lib/game'
import FeaturesList from '@/lib/games/features-list'
import GameTable from '@/lib/games/game-table'

export default class InflectionGame extends Game {
  constructor (view) {
    super(view)
    this.view = view
    this.partOfSpeech = view.partOfSpeech
    this.type = InflectionGame.gameType
  }

  static get gameType () {
    return 'Guess inflection'
  }

  createGameStuff () {
    this.render()

    this.gameTable = new GameTable(this.view)

    this.featuresList = new FeaturesList(this.view)
  }

  clearGameStuff () {
    if (this.gameTable) {
      this.gameTable.clearValuesStatus()
    }
    if (this.featuresList) {
      this.featuresList.clearValuesStatus()
    }
  }

  static getFeatures (cell) {
    let ignoreCellProps = ['role', 'value', 'fullMatch', 'hidden']
    return Object.keys(cell).filter(prop => ignoreCellProps.indexOf(prop) === -1)
  }

  static compareLexemesToCell (homonym, cell) {
    let cellFeatures = InflectionGame.getFeatures(cell)

    return homonym.lexemes.some(lexeme =>
      lexeme.inflections.some(inflection =>
        cellFeatures.every(feature => inflection.hasOwnProperty(feature) && inflection[feature].value === cell[feature])
      )
    )
  }

  findFullMatchInView () {
    if (!this.view.hasPrerenderedTables) {
      return this.view.morphemes.some(morpheme => morpheme.match.fullMatch)
    } else if (this.paradigm) {
      return this.view.wideTable.rows.some(row =>
        row.cells.some(cell => (cell.role === 'data') && InflectionGame.compareLexemesToCell(this.view.homonym, cell))
      )
    }
  }

  checkViewFormatCorrect () {
    return this.view.isImplemented
  }

  matchViewsCheck () {
    this.render()
    console.info('*******************matchViewsCheck', this.view)
    return this.checkViewFormatCorrect() && this.findFullMatchInView()
  }
}

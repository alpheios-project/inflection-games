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

    this.gameTable = new GameTable()
    this.gameTable.uploadTable(this.view)

    this.featuresList = new FeaturesList()
    this.featuresList.uploadFeatures(this.view)
  }

  clearGameStuff () {
    if (this.gameTable) {
      this.gameTable.clearValuesStatus()
    }
    if (this.featuresList) {
      this.featuresList.clearValuesStatus()
    }
  }

  findFullMatchInWideView () {
    return this.view.morphemes.some(morpheme => morpheme.match.fullMatch)
  }

  findFullMatchInWideTable () {
    let hasFullMatch = false

    if (this.view.homonym && this.view.homonym.inflections) {
      for (let row of this.view.wideTable.rows) {
        for (let cell of row.cells) {
          if (cell.role === 'data') {
            let comparativeFeatures = Object.keys(cell).filter(key => ['role', 'value', 'fullMatch'].indexOf(key) === -1)
            cell.fullMatch = false

            for (const inflection of this.view.homonym.inflections) {
              let fullMatch = true
              for (const feature of comparativeFeatures) {
                fullMatch = fullMatch && inflection.hasOwnProperty(feature) && cell[feature].hasValues(inflection[feature].values)

                if (!fullMatch) { break } // If at least one feature does not match, there is no reason to check others
              }
              if (fullMatch) {
                hasFullMatch = hasFullMatch || fullMatch
                cell.fullMatch = true
              }
            }
          }
        }
      }
    }
    return hasFullMatch
  }

  checkHasFullMatchByViewType () {
    if (!this.view.hasPrerenderedTables) {
      return this.findFullMatchInWideView()
    } else {
      return this.findFullMatchInWideTable()
    }
  }

  checkViewFormatCorrect () {
    return this.view.isImplemented
  }

  matchViewsCheck () {
    this.render()
    return this.checkViewFormatCorrect() && this.checkHasFullMatchByViewType()
  }
}

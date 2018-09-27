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

  get featuresListTitles () {
    return this.featuresList.featuresListTitles
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

import InflectionGame from '@/lib/games/inflection-game'

export default class GamesSet {
  constructor (inflectionsViewSet) {
    this.inflectionsViewSet = inflectionsViewSet
    // this.locale = locale

    // this.viewSet = new ViewSet(this.inflectionData, this.locale)
    this.partsOfSpeech = this.inflectionsViewSet.partsOfSpeech

    this.games = [ InflectionGame ]
    this.matchingGames = []

    this.getMatchingViewsGames()
    console.info('****************matchingGames', this.matchingGames)
    this.createGamesList()
  }

  getMatchingViewsGames () {
    console.info('**********************this.partsOfSpeech', this.partsOfSpeech)
    this.games.forEach((game, index) => {
      this.partsOfSpeech.forEach(partOfSpeech => {
        console.info('**********************partOfSpeech', partOfSpeech)
        this.inflectionsViewSet.getViews(partOfSpeech).forEach(view => {
          console.info('**********************partOfSpeech view', view)
          if (game.matchViewsCheck(view)) {
            this.matchingGames.push(new this.games[index](view))
          }
        })
      })
    })
  }

  createGamesList () {
    let gamesList = {}
    this.matchingGames.forEach(game => { gamesList[game.gameType] = [] })

    this.matchingGames.forEach(game => {
      gamesList[game.gameType].push(game)
    })
    this.gamesList = gamesList
    console.info('****************matchingGames', this.gamesList)
  }
}

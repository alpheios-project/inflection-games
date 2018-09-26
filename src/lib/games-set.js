import InflectionGame from '@/lib/games/inflection-game'

export default class GamesSet {
  constructor (inflectionsViewSet) {
    // this.inflectionsViewSet = inflectionsViewSet
    this.partsOfSpeech = inflectionsViewSet.partsOfSpeech

    this.games = [ InflectionGame ]
    this.matchingGames = {}

    this.getMatchingViewsGames(inflectionsViewSet)
    this.createGamesList()
  }

  initMatchingGameWithType (gameType) {
    if (this.matchingGames[gameType] === undefined) {
      this.matchingGames[gameType] = {}
    }
  }

  addGameToMatchingGames (gameIndex, view, gameType) {
    let newGame = new this.games[gameIndex](view)

    if (newGame.matchViewsCheck(view)) {
      this.initMatchingGameWithType(gameType)
      this.matchingGames[gameType][newGame.id] = newGame
    }
  }

  getMatchingViewsGames (inflectionsViewSet) {
    this.games.forEach((game, gameIndex) => {
      this.partsOfSpeech.forEach(partOfSpeech => {
        inflectionsViewSet
          .getViews(partOfSpeech)
          .forEach(view => this.addGameToMatchingGames(gameIndex, view, game.gameType))
      })
    })
  }

  addGameToGameList (gameType, gameId) {
    if (this.matchingGames[gameType] && this.matchingGames[gameType][gameId]) {
      let game = this.matchingGames[gameType][gameId]

      if (!this.gamesList[gameType]) { this.gamesList[gameType] = {} }

      this.gamesList[gameType][gameId] = {
        id: game.id,
        name: game.name,
        partOfSpeech: game.partOfSpeech,
        type: gameType
      }
    }
  }

  createGamesList () {
    this.gamesList = {}
    for (let gameType in this.matchingGames) {
      for (let gameId in this.matchingGames[gameType]) {
        this.addGameToGameList(gameType, gameId)
      }
    }
  }
}

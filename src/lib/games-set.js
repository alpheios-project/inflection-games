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

  getMatchingViewsGames (inflectionsViewSet) {
    this.games.forEach((game, index) => {
      this.partsOfSpeech.forEach(partOfSpeech => {
        inflectionsViewSet.getViews(partOfSpeech).forEach(view => {
          let newGame = new this.games[index](view)
          if (newGame.matchViewsCheck(view)) {
            if (this.matchingGames[game.gameType] === undefined) {
              this.matchingGames[game.gameType] = {}
            }

            this.matchingGames[game.gameType][newGame.id] = newGame
          }
        })
      })
    })
  }

  createGamesList () {
    let gamesList = {}
    Object.keys(this.matchingGames).forEach(gameType => { gamesList[gameType] = [] })

    for (let gameType in this.matchingGames) {
      gamesList[gameType] = {}
      for (let gameId in this.matchingGames[gameType]) {
        let game = this.matchingGames[gameType][gameId]
        gamesList[gameType][gameId] = {
          id: game.id,
          name: game.name,
          partOfSpeech: game.partOfSpeech,
          type: gameType
        }
      }
    }

    this.gamesList = gamesList
  }
}

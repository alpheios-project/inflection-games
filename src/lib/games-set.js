import { ViewSet } from 'alpheios-inflection-tables'

import InflectionGame from '@/lib/games/inflection-game'

export default class GamesSet {
  constructor (inflectionData, locale) {
    this.inflectionData = inflectionData
    this.locale = locale

    this.viewSet = new ViewSet(this.inflectionData, this.locale)
    this.partsOfSpeech = this.viewSet.partsOfSpeech

    this.games = [ InflectionGame ]
    this.matchingGames = []

    this.getMatchingViewsGames()
    this.createGamesList()
  }

  getMatchingViewsGames () {
    this.games.forEach((game, index) => {
      this.partsOfSpeech.forEach(partOfSpeech => {
        this.viewSet.getViews(partOfSpeech).forEach(view => {
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
  }
}

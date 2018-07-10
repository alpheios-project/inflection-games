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
    this.gamesList = this.matchingGames.map(game => {
      return {
        'gameName': game.gameType,
        'partOfSpeech': game.partOfSpeech,
        'view_id': game.id,
        'view_name': game.name
      }
    })
  }

  getViewByGameListItem (gameListItem) {
    return this.matchingGames.find(game => game.id === gameListItem.view_id)
  }

/*
  createFilteredPartsOfSpeech () {
    this.filteredPartsOfSpeech = this.partsOfSpeech.filter(partOfSpeech => this.viewSet.getViews(partOfSpeech).filter(view => view.hasComponentData).length > 0)
  }

  createGamesVariants () {
    let variants = []

    this.filteredPartsOfSpeech.forEach(partOfSpeech =>
      this.getViewsByPartOfSpeech(partOfSpeech).forEach(view =>
        variants.push({ partOfSpeech: partOfSpeech, view: view })
      )
    )
    this.gamesVariants = variants
  }

  getViewByDataFromTheList (gameVariant) {
    return this.viewSet.getViews(gameVariant.partOfSpeech).find(view => view.id === gameVariant.view_id)
  }

  getFeatures (cell) {
    return Object.keys(cell).filter(prop => (prop !== 'role' && prop !== 'value'))
  }

  compareLexemesToCell (cell) {
    let cellFeatures = this.getFeatures(cell)

    return this.inflectionData.homonym.lexemes.some(lexeme =>
      lexeme.inflections.some(inflection =>
        cellFeatures.every(feature => inflection.hasOwnProperty(feature) && inflection[feature].value === cell[feature])
      )
    )
  }

  findFullMatchInView (view) {
    return view.wideTable.rows.some(row =>
      row.cells.some(cell => (cell.role === 'data') && this.compareLexemesToCell(cell))
    )
  }

  filterViewsWithFullMatch (viewsArray) {
    return viewsArray.filter(view => this.findFullMatchInView(view))
  }

  getViewsByPartOfSpeech (partOfSpeech) {
    return this.filterViewsWithFullMatch(this.viewSet.getViews(partOfSpeech))
  }
  */
}

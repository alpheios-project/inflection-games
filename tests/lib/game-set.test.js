/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { ViewSetFactory } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('games-set.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let maAdapter, testHomonym, inflectionsViewSet

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym(Constants.LANG_LATIN, 'caeli')
    inflectionsViewSet = ViewSetFactory.create(testHomonym, 'en-US')
  })
  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 GamesSet - new constructor create GameSet with properties', async () => {
    let gameSet = new GamesSet(inflectionsViewSet, 'en-US')

    expect(gameSet.partsOfSpeech).toEqual(['noun'])
    expect(gameSet.games.length).toBeGreaterThan(0)
    expect(Object.values(gameSet.matchingGames).length).toBeGreaterThan(0)
    expect(Object.values(gameSet.gamesList).length).toBeGreaterThan(0)
  })

  it('2 GamesSet - initMatchingGameWithType creates empty subobject for gameType', () => {
    let gameSet = new GamesSet(inflectionsViewSet, 'en-US')

    expect(Object.keys(gameSet.matchingGames).length).toEqual(1)

    gameSet.initMatchingGameWithType('type1')
    expect(Object.keys(gameSet.matchingGames).length).toEqual(2)

    gameSet.initMatchingGameWithType('type1')
    expect(Object.keys(gameSet.matchingGames).length).toEqual(2)
  })

  it('3 GamesSet - addGameToMatchingGames creates, checks and add game to matching games (success result)', () => {
    let gameSet = new GamesSet(inflectionsViewSet, 'en-US')

    let gameIndex = 0
    let view = 'fooView'
    let fooGame = { id: 1, matchViewsCheck: jest.fn(() => true) }
    gameSet.games[0] = jest.fn(() => fooGame)

    gameSet.addGameToMatchingGames(gameIndex, view, 'fooType')

    expect(gameSet.matchingGames['fooType']).toBeDefined()
    expect(gameSet.matchingGames['fooType'][1]).toEqual(fooGame)
  })

  it('4 GamesSet - addGameToMatchingGames creates, checks and add game to matching games (failed result)', () => {
    let gameSet = new GamesSet(inflectionsViewSet, 'en-US')

    let gameIndex = 0
    let view = 'fooView'
    let fooGame = { id: 1, matchViewsCheck: jest.fn(() => false) }
    gameSet.games[0] = jest.fn(() => fooGame)

    gameSet.addGameToMatchingGames(gameIndex, view, 'fooType')

    expect(gameSet.matchingGames['fooType']).toBeUndefined()
  })

  it('5 GamesSet - addGameToGameList checks if game in matching games and adds to gameList', () => {
    let gameSet = new GamesSet(inflectionsViewSet, 'en-US')
    let existedGameType = InflectionGame.gameType
    let existedGameId = Object.keys(gameSet.gamesList[InflectionGame.gameType])[0]

    // clear gameList for testing
    gameSet.gamesList = {}

    gameSet.addGameToGameList(existedGameType, existedGameId)
    expect(Object.keys(gameSet.gamesList[existedGameType]).length).toEqual(1)

    let nonExistedGameId = 'fooGameId'
    gameSet.addGameToGameList(existedGameType, 'fooGameId')
    expect(Object.keys(gameSet.gamesList[existedGameType]).length).toEqual(1)
  })
})

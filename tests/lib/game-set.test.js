/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { LanguageDatasetFactory as LDFAdapter } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('games-set.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let maAdapter, testHomonym, testInflectionData

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym(Constants.LANG_GREEK, 'συνδέει')
    testInflectionData = await LDFAdapter.getInflectionData(testHomonym)
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
    let gameSet = new GamesSet(testInflectionData, 'en-US')

    expect(gameSet.inflectionData).toEqual(testInflectionData)
    expect(gameSet.locale).toEqual('en-US')

    expect(gameSet.games.length).toBeGreaterThan(0)
    expect(gameSet.matchingGames.length).toBeGreaterThan(0)

    expect(gameSet.gamesList).toBeInstanceOf(Object)
  })

  it('2 GamesSet - creates gamesList as a structured object for "Guess inflection"', () => {
    let gameSet = new GamesSet(testInflectionData, 'en-US')

    expect(Object.keys(gameSet.gamesList)).toContain('Guess inflection')
    expect(gameSet.gamesList['Guess inflection'].length).toEqual(3)

    expect(gameSet.gamesList['Guess inflection'].every(game => game instanceof InflectionGame)).toBeTruthy()
  })
})

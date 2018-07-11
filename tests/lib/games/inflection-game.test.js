/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { LanguageDatasetFactory as LDFAdapter } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Feature, Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('inflection-game.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let maAdapter, testHomonym, testInflectionData, gameSet, gameView

  let featureFullMatch, featureNotFullMatch, featuresListForFeaturePanel

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym('grc', 'συνδέει')
    testInflectionData = await LDFAdapter.getInflectionData(testHomonym)

    gameSet = new GamesSet(testInflectionData, 'en-US')
    gameView = gameSet.viewSet.getViews('verb').find(view => InflectionGame.matchViewsCheck(view))

    featureFullMatch = new Feature('tense', 'present', Constants.LANG_GREEK)
    featureNotFullMatch = new Feature('number', 'dual', Constants.LANG_GREEK)

    featuresListForFeaturePanel = ['tense', 'number', 'person', 'mood']
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

  it('1 InflectionGame - new constructor with view that has partOfSpeech', () => {
    let game = new InflectionGame(gameView)

    expect(game.view).toEqual(gameView)
    expect(game.gameType).toEqual('Guess inflection')
    expect(game.id).toEqual(gameView.id)
    expect(game.name).toEqual(gameView.name)
    expect(game.partOfSpeech).toEqual('verb')

    expect(game.gameTable).toBeDefined()
    expect(game.featuresList).toBeDefined()
  })

  it('2 InflectionGame - createGameStuff method creates gameTable and featuresList', () => {
    let game = new InflectionGame(gameView)

    expect(game.gameTable.rows.length).toEqual(gameView.wideTable.rows.length)

    let gameTableCheck = game.gameTable.rows.every(row => row.cells.filter(cell => cell.role === 'data').every(cell => cell.fullMatch !== undefined && cell.hidden))
    expect(gameTableCheck).toBeTruthy()

    expect(Object.keys(game.featuresList).length).toBeGreaterThan(0)

    let featuresListCheck = Object.values(game.featuresList).every(featureArray =>
      featureArray.every(feature => feature.status === null && feature.value !== undefined)
    )

    expect(featuresListCheck).toBeTruthy()
  })

  it('3 InflectionGame - clearGameStuff method returns gameTable and featuresList to the starting state ', () => {
    let game = new InflectionGame(gameView)

    /** *** make game stuff used *****/
    game.gameTable.rows.forEach(row => { row.cells.forEach(cell => { cell.hidden = false }) })
    Object.values(game.featuresList).forEach(featureArray => featureArray.forEach(feature => { feature.status = 'failed' }))

    let gameTableCheck = game.gameTable.rows.every(row => row.cells.filter(cell => cell.role === 'data').every(cell => cell.fullMatch !== undefined && cell.hidden))
    expect(gameTableCheck).not.toBeTruthy()

    let featuresListCheck = Object.values(game.featuresList).every(featureArray =>
      featureArray.every(feature => feature.status === null && feature.value !== undefined)
    )

    expect(featuresListCheck).not.toBeTruthy()

    /** *** make game stuff used *****/

    game.clearGameStuff()
    let gameTableCheckCleared = game.gameTable.rows.every(row => row.cells.filter(cell => cell.role === 'data').every(cell => cell.fullMatch !== undefined && cell.hidden))
    expect(gameTableCheckCleared).toBeTruthy()

    let featuresListCheckCleared = Object.values(game.featuresList).every(featureArray =>
      featureArray.every(feature => feature.status === null && feature.value !== undefined)
    )
    expect(featuresListCheckCleared).toBeTruthy()
  })

  it('4 InflectionGame - clearGameStuff method makes nothing if there are no gameTable and featuresList ', () => {
    let game = new InflectionGame(gameView)

    game.gameTable = undefined
    game.featuresList = undefined

    game.clearGameStuff()

    expect(game.gameTable).toBeUndefined()
    expect(game.featuresList).toBeUndefined()
  })

  it('5 InflectionGame - featureHasFullMatch method returns true for feature with fullMatch', () => {
    let game = new InflectionGame(gameView)

    expect(game.featureHasFullMatch(featureFullMatch.type, { value: featureFullMatch.value })).toBeTruthy()
    expect(game.featureHasFullMatch(featureNotFullMatch.type, { value: featureNotFullMatch.value })).toBeFalsy()
  })

  it('6 InflectionGame - featuresListTitles method returns features list keys for features with more than one value', () => {
    let game = new InflectionGame(gameView)

    let featuresListTitles = game.featuresListTitles

    expect(featuresListTitles.length).toEqual(featuresListForFeaturePanel.length)
    expect(featuresListTitles.every(item => featuresListForFeaturePanel.indexOf(item) > -1)).toBeTruthy()
  })
})

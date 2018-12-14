/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { ViewSetFactory } from 'alpheios-inflection-tables'
import { ClientAdapters } from 'alpheios-client-adapters'
import { Feature, Constants } from 'alpheios-data-models'

import InflectionGame from '@/lib/games/inflection-game.js'

describe('inflection-game.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let featureFullMatch, featureNotFullMatch, featuresListForFeaturePanel

  let testHomonym, testInflectionsViewSet, testLocale, gameView

  beforeAll(async () => {
    let resTestHomonym = await ClientAdapters.morphology.tufts({
      method: 'getHomonym',
      params: {
        languageID: Constants.LANG_LATIN,
        word: 'caeli'
      }
    })
    testHomonym = resTestHomonym.result
    testLocale = 'en-US'
    testInflectionsViewSet = ViewSetFactory.create(testHomonym, testLocale)

    gameView = testInflectionsViewSet.getViews('noun')[0]

    featureFullMatch = new Feature('type', 'regular', Constants.LANG_LATIN)
    featureNotFullMatch = new Feature('type', 'irregular', Constants.LANG_LATIN)

    featuresListForFeaturePanel = ['number', 'type', 'case']
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
    game.createGameStuff()

    expect(game.view).toEqual(gameView)
    expect(game.id).toEqual(gameView.id)
    expect(game.name).toEqual(gameView.name)
    expect(game.partOfSpeech).toEqual('noun')

    expect(game.gameTable).toBeDefined()
    expect(game.featuresList).toBeDefined()
  })

  it('2 InflectionGame - createGameStuff method creates gameTable and featuresList', () => {
    let game = new InflectionGame(gameView)
    game.createGameStuff()

    expect(game.gameTable.rows.length).toEqual(gameView.wideView.rows.length)

    let gameTableCheck = game.gameTable.rows.every(row => row.cells.filter(cell => cell.isDataCell).every(cell => cell.fullMatch !== undefined && cell.gameHidden))
    expect(gameTableCheck).toBeTruthy()

    expect(Object.keys(game.featuresList).length).toBeGreaterThan(0)

    let featuresListCheck = Object.values(game.featuresList.features).every(featureArray =>
      featureArray.every(feature => feature.status === null && feature.value !== undefined)
    )

    expect(featuresListCheck).toBeTruthy()
  })

  it('3 InflectionGame - clearGameStuff method returns gameTable and featuresList to the starting state ', () => {
    let game = new InflectionGame(gameView)
    game.createGameStuff()

    game.gameTable.rows.forEach(row => { row.cells.forEach(cell => { cell.gameHidden = false }) })
    Object.values(game.featuresList.features).forEach(featureArray => featureArray.forEach(feature => { feature.status = 'failed' }))

    let gameTableCheck = game.gameTable.rows.every(row => row.cells.filter(cell => cell.isDataCell).every(cell => cell.fullMatch !== undefined && cell.gameHidden))
    expect(gameTableCheck).not.toBeTruthy()

    let featuresListCheck = Object.values(game.featuresList.features).every(featureArray =>
      featureArray.every(feature => feature.status === null && feature.value !== undefined)
    )

    expect(featuresListCheck).not.toBeTruthy()

    game.clearGameStuff()
    let gameTableCheckCleared = game.gameTable.rows.every(row => row.cells.filter(cell => cell.isDataCell).every(cell => cell.fullMatch !== undefined && cell.gameHidden))
    expect(gameTableCheckCleared).toBeTruthy()

    let featuresListCheckCleared = Object.values(game.featuresList.features).every(featureArray =>
      featureArray.every(feature => feature.status === null && feature.value !== undefined)
    )
    expect(featuresListCheckCleared).toBeTruthy()
  })

  it('4 InflectionGame - clearGameStuff method makes nothing if there are no gameTable and featuresList ', () => {
    let game = new InflectionGame(gameView)
    game.createGameStuff()

    game.gameTable = undefined
    game.featuresList = undefined

    game.clearGameStuff()

    expect(game.gameTable).toBeUndefined()
    expect(game.featuresList).toBeUndefined()
  })

  it('5 InflectionGame - matchViewsCheck executes render, checkViewFormatCorrect, checkHasFullMatchByViewType', () => {
    let game = new InflectionGame(gameView)

    game.render = jest.fn()
    game.checkViewFormatCorrect = jest.fn(() => true)
    game.checkHasFullMatchByViewType = jest.fn(() => true)

    game.matchViewsCheck()

    expect(game.render).toHaveBeenCalled()
    expect(game.checkViewFormatCorrect).toHaveBeenCalled()
    expect(game.checkHasFullMatchByViewType).toHaveBeenCalled()
  })

  it('6 InflectionGame - checkViewFormatCorrect checks if view is implemented', () => {
    let game = new InflectionGame(gameView)
    expect(game.checkViewFormatCorrect()).toBeTruthy()

    gameView.isImplemented = false
    expect(game.checkViewFormatCorrect()).toBeFalsy()

    gameView.isImplemented = true
  })

  it('7 InflectionGame - checkHasFullMatchByViewType executes findFullMatchInWideView if the view.hasPrerenderedTables = false', () => {
    let game = new InflectionGame(gameView)
    game.findFullMatchInWideView = jest.fn()
    game.checkHasFullMatchByViewType()

    expect(gameView.hasPrerenderedTables).toBeFalsy()
    expect(game.findFullMatchInWideView).toHaveBeenCalled()
  })

  it('8 InflectionGame - checkHasFullMatchByViewType executes findFullMatchInWideTable if the view.hasPrerenderedTables = true', () => {
    let game = new InflectionGame(gameView)
    game.findFullMatchInWideTable = jest.fn()

    gameView.hasPrerenderedTables = true
    game.checkHasFullMatchByViewType()

    expect(game.findFullMatchInWideTable).toHaveBeenCalled()

    gameView.hasPrerenderedTables = false
  })

  it('9 InflectionGame - findFullMatchInWideView returns true if even one morpheme has full match', () => {
    let game = new InflectionGame(gameView)

    expect(gameView.morphemes.some(morpheme => morpheme.match.fullMatch)).toBeTruthy()
    expect(game.findFullMatchInWideView()).toBeTruthy()
  })

  it('10 InflectionGame - findFullMatchInWideTable returns true if even one cell has full match (paradigm)', async () => {
    let resTestHomonym2 = await ClientAdapters.morphology.tufts({
      method: 'getHomonym',
      params: {
        languageID: Constants.LANG_GREEK,
        word: 'ἔννεπε'
      }
    })
    let testHomonymVerb = resTestHomonym2.result

    let testInflectionsViewSetVerb = ViewSetFactory.create(testHomonymVerb, testLocale)

    let gameViewParadigm = testInflectionsViewSetVerb.getViews('verb')[0]
    let game = new InflectionGame(gameViewParadigm)
    expect(game.findFullMatchInWideTable()).toBeTruthy()
  })

  it('10 InflectionGame - findFullMatchInWideTable returns false if view hasn\'t homonym or inflections', async () => {
    let resTestHomonym2 = await ClientAdapters.morphology.tufts({
      method: 'getHomonym',
      params: {
        languageID: Constants.LANG_GREEK,
        word: 'ἔννεπε'
      }
    })
    let testHomonymVerb = resTestHomonym2.result
    let testInflectionsViewSetVerb = ViewSetFactory.create(testHomonymVerb, testLocale)

    let gameViewParadigm = testInflectionsViewSetVerb.getViews('verb')[0]
    gameViewParadigm.homonym = undefined

    let game = new InflectionGame(gameViewParadigm)
    expect(game.findFullMatchInWideTable()).toBeFalsy()
  })
})

/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { ViewSetFactory } from 'alpheios-inflection-tables'
import { ClientAdapters } from 'alpheios-client-adapters'
import { Constants } from 'alpheios-data-models'

import GameTable from '@/lib/games/game-table.js'
import InflectionGame from '@/lib/games/inflection-game'

describe('game-table.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let testLocale
  let testHomonym1, testInflectionsViewSet1, gameView1, game1
  let testHomonym2, testInflectionsViewSet2, gameView2, game2

  beforeAll(async () => {
    testLocale = 'en-US'

    let resTestHomonym1 = await ClientAdapters.morphology.tufts({
      method: 'getHomonym',
      params: {
        languageID: Constants.LANG_LATIN,
        word: 'caeli'
      }
    })
    testHomonym1 = resTestHomonym1.result

    testInflectionsViewSet1 = ViewSetFactory.create(testHomonym1, testLocale)
    gameView1 = testInflectionsViewSet1.getViews('noun')[0]
    game1 = new InflectionGame(gameView1)
    game1.matchViewsCheck()

    let resTestHomonym2 = await ClientAdapters.morphology.tufts({
      method: 'getHomonym',
      params: {
        languageID: Constants.LANG_GREEK,
        word: 'ἔννεπε'
      }
    })
    testHomonym2 = resTestHomonym2.result

    testInflectionsViewSet2 = ViewSetFactory.create(testHomonym2, testLocale)
    gameView2 = testInflectionsViewSet2.getViews('verb')[0]
    game2 = new InflectionGame(gameView2)
    game2.matchViewsCheck()
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

  it('1 GameTable - uploads table using uploadTableFromWideTable, if view.hasPrerenderedTables', () => {
    let testGameTable = new GameTable()

    testGameTable.uploadTableFromWideTable = jest.fn()
    testGameTable.uploadTableFromWideView = jest.fn()

    testGameTable.uploadTable(gameView1)
    expect(gameView1.hasPrerenderedTables).toBeFalsy()
    expect(testGameTable.uploadTableFromWideView).toHaveBeenCalled()
    expect(testGameTable.uploadTableFromWideTable).not.toHaveBeenCalled()
  })

  it('2 GameTable - uploads table using uploadTableFromWideView, if !view.hasPrerenderedTables', () => {
    let testGameTable = new GameTable()

    testGameTable.uploadTableFromWideTable = jest.fn()
    testGameTable.uploadTableFromWideView = jest.fn()

    testGameTable.uploadTable(gameView2)
    expect(gameView2.hasPrerenderedTables).toBeTruthy()
    expect(testGameTable.uploadTableFromWideView).not.toHaveBeenCalled()
    expect(testGameTable.uploadTableFromWideTable).toHaveBeenCalled()
  })

  it('3 GameTable - showAllCells makes all data cells not hidden', () => {
    let testGameTable = new GameTable()
    testGameTable.uploadTable(gameView2)

    expect(testGameTable.rows.every(row => row.cells.filter(cell => cell.isDataCell).every(cell => cell.gameHidden))).toBeTruthy()

    testGameTable.showAllCells()

    expect(testGameTable.rows.every(row => row.cells.filter(cell => cell.isDataCell).every(cell => !cell.gameHidden))).toBeTruthy()
  })

  it('4 GameTable - checkFailedFeature makes cells with this feature value as not hidden', () => {
    let testGameTable = new GameTable()
    testGameTable.uploadTable(gameView1)

    let testFeatureName = 'gender'
    let testFeatureValue = 'femine'

    expect(testGameTable.rows.every(row =>
      row.cells
        .filter(cell => cell.isDataCell && (cell.features[testFeatureName] === testFeatureValue))
        .every(cell => cell.gameHidden)
    )).toBeTruthy()

    testGameTable.checkFailedFeature(testFeatureName, testFeatureValue)

    expect(testGameTable.rows.every(row =>
      row.cells
        .filter(cell => cell.isDataCell && (cell.features[testFeatureName] === testFeatureValue))
        .every(cell => !cell.gameHidden)
    )).toBeTruthy()
  })

  it('5 GameTable - checkSuccessFeature makes cells with not this feature value as not hidden', () => {
    let testGameTable = new GameTable()
    testGameTable.uploadTable(gameView1)

    let testFeatureName = 'type'
    let testFeatureValue = 'regular'
    let featureListByName = [{ value: 'regular', hasFullMatch: true }, { value: 'irregular', hasFullMatch: false }]

    expect(testGameTable.rows.every(row =>
      row.cells
        .filter(cell => cell.isDataCell && !featureListByName.find(feat => feat.value === cell.features[testFeatureName]).hasFullMatch && (cell.features[testFeatureName] !== testFeatureValue))
        .every(cell => cell.gameHidden)
    )).toBeTruthy()

    testGameTable.checkSuccessFeature(testFeatureName, testFeatureValue, featureListByName)

    expect(testGameTable.rows.every(row =>
      row.cells
        .filter(cell => cell.isDataCell && !featureListByName.find(feat => feat.value === cell.features[testFeatureName]).hasFullMatch && (cell.features[testFeatureName] !== testFeatureValue))
        .every(cell => !cell.gameHidden)
    )).toBeTruthy()
  })

  it('6 GameTable - isOnlyFullMatchUncovered checks if only cells with full match are covered', () => {
    let testGameTable = new GameTable()
    testGameTable.uploadTable(gameView1)

    expect(testGameTable.isOnlyFullMatchUncovered).toBeFalsy()
    testGameTable.showAllCells()
    expect(testGameTable.isOnlyFullMatchUncovered).toBeTruthy()
  })

  it('7 GameTable - clearValuesStatus returns gameCells to hidden', () => {
    let testGameTable = new GameTable()
    testGameTable.uploadTable(gameView1)

    testGameTable.showAllCells()
    expect(testGameTable.rows.every(row => row.cells.every(cell => cell.gameHidden === cell.isDataCell))).toBeFalsy()

    testGameTable.clearValuesStatus()
    expect(testGameTable.rows.every(row => row.cells.every(cell => cell.gameHidden === cell.isDataCell))).toBeTruthy()
  })
})

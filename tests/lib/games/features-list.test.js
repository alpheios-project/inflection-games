/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { ViewSetFactory } from 'alpheios-inflection-tables'
import { ClientAdapters } from 'alpheios-client-adapters'
import { Constants } from 'alpheios-data-models'

import FeaturesList from '@/lib/games/features-list.js'
import InflectionGame from '../../../src/lib/games/inflection-game'

describe('features-list.test.js', () => {
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

  it('1 FeaturesList - uploads features using uploadFeaturesFromWideTable, if view.hasPrerenderedTables', () => {
    let testFeaturesList = new FeaturesList()

    testFeaturesList.uploadFeaturesFromWideTable = jest.fn()
    testFeaturesList.uploadFeaturesFromWideView = jest.fn()

    testFeaturesList.uploadFeatures(gameView1)
    expect(gameView1.hasPrerenderedTables).toBeFalsy()
    expect(testFeaturesList.uploadFeaturesFromWideView).toHaveBeenCalled()
    expect(testFeaturesList.uploadFeaturesFromWideTable).not.toHaveBeenCalled()
  })

  it('2 FeaturesList - uploads features using uploadFeaturesFromWideView, if !view.hasPrerenderedTables', () => {
    let testFeaturesList = new FeaturesList()

    testFeaturesList.uploadFeaturesFromWideTable = jest.fn()
    testFeaturesList.uploadFeaturesFromWideView = jest.fn()

    testFeaturesList.uploadFeatures(gameView2)
    expect(gameView2.hasPrerenderedTables).toBeTruthy()
    expect(testFeaturesList.uploadFeaturesFromWideView).not.toHaveBeenCalled()
    expect(testFeaturesList.uploadFeaturesFromWideTable).toHaveBeenCalled()
  })

  it('3 FeaturesList - uploadFeaturesFromWideTable returns features collected from wideTable', () => {
    let testFeaturesList = new FeaturesList()
    expect(testFeaturesList.features).toBeUndefined()

    testFeaturesList.uploadFeaturesFromWideTable(game2.view)
    expect(Object.keys(testFeaturesList.features)).toEqual(['number', 'person', 'mood'])
  })

  it('4 FeaturesList - uploadFeaturesFromWideView returns features collected from wideView', () => {
    let testFeaturesList = new FeaturesList()
    expect(testFeaturesList.features).toBeUndefined()

    testFeaturesList.uploadFeaturesFromWideView(game1.view)
    expect(Object.keys(testFeaturesList.features)).toEqual(['declension', 'gender', 'type', 'case'])
  })

  it('5 FeaturesList - featuresTitles returns features names tat can be used in the feature\'s panel', () => {
    let testFeaturesList = new FeaturesList()
    expect(testFeaturesList.features).toBeUndefined()

    testFeaturesList.uploadFeaturesFromWideView(game1.view)
    expect(testFeaturesList.featuresTitles).toEqual(['declension', 'gender', 'type', 'case'])
  })

  it('6 FeaturesList - showAllFeatures changes status for each feature to success/failed', () => {
    let testFeaturesList = new FeaturesList()
    testFeaturesList.uploadFeatures(game1.view)

    expect(Object.values(testFeaturesList.features).some(featuresArr => featuresArr.some(feature => feature.status === null))).toBeTruthy()
    testFeaturesList.showAllFeatures()

    expect(Object.values(testFeaturesList.features).every(featuresArr => featuresArr.every(feature => feature.status === 'success' || feature.status === 'failed'))).toBeTruthy()
  })

  it('7 FeaturesList - clearValuesStatus changes status for each feature to null', () => {
    let testFeaturesList = new FeaturesList()
    testFeaturesList.uploadFeatures(game1.view)
    testFeaturesList.showAllFeatures()

    testFeaturesList.clearValuesStatus()
    expect(Object.values(testFeaturesList.features).every(featuresArr => featuresArr.every(feature => feature.status === null))).toBeTruthy()
  })

  it('8 FeaturesList - getUncheckedFeatureValues returns all values for feature type that status ===  null', () => {
    let testFeaturesList = new FeaturesList()
    testFeaturesList.uploadFeatures(game1.view)

    expect(testFeaturesList.getUncheckedFeatureValues('declension').length).toEqual(testFeaturesList.features['declension'].length)
  })
})

/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { shallowMount, mount } from '@vue/test-utils'
import FeatureSelectBlock from '@/vue-components/game-components/feature-select-block.vue'

import { ViewSetFactory } from 'alpheios-inflection-tables'
import { ClientAdapters } from 'alpheios-client-adapters'
import { Feature, Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('feature-select-block.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, testHomonym, testInflectionsViewSet, testLocale, gameSet, testSelectedGame, testFeatureList
  let featureFullMatch, featureNotFullMatch

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

    gameSet = new GamesSet(testInflectionsViewSet, 'en-US')
    featureFullMatch = new Feature('type', 'regular', Constants.LANG_LATIN)
    featureFullMatch.hasFullMatch = true

    featureNotFullMatch = new Feature('type', 'irregular', Constants.LANG_LATIN)
    featureNotFullMatch.hasFullMatch = false
  })

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    let existedGameType = InflectionGame.gameType
    let existedGameId = Object.keys(gameSet.gamesList[existedGameType])[0]

    testSelectedGame = gameSet.matchingGames[existedGameType][existedGameId]
    testSelectedGame.createGameStuff()

    testFeatureList = testSelectedGame.featuresList

    cmp = mount(FeatureSelectBlock, {
      propsData: {
        featuresList: testFeatureList,
        finishGameFlag: false
      }
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 FeatureSelectBlock - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
  })

  it('2 FeatureSelectBlock - featuresTitles - returns featuresListTitles of the gamesList', () => {
    expect(cmp.vm.featuresTitles).toEqual(testFeatureList.featuresTitles)

    cmp.setProps({
      featuresList: {}
    })

    expect(cmp.vm.featuresTitles).toBeUndefined()
  })

  it('3 FeatureSelectBlock - features - returns features of the gamesList', () => {
    expect(cmp.vm.features).toEqual(testFeatureList.features)

    cmp.setProps({
      featuresList: {}
    })

    expect(cmp.vm.features).toBeUndefined()
  })

  it('4 FeatureSelectBlock - featureItemClass - returns classes depends on featureValue status', () => {
    expect(cmp.vm.featureItemClass({ value: 'fooValue', status: null }, 'fooName')).toEqual({
      'alpheios-features-select-block__list_values__item': true,
      'alpheios-features-select-block__list_values__item__success': false,
      'alpheios-features-select-block__list_values__item__failed': false,
      'fooName': true
    })

    expect(cmp.vm.featureItemClass({ value: 'fooValue', status: 'success' }, 'fooName')).toEqual({
      'alpheios-features-select-block__list_values__item': true,
      'alpheios-features-select-block__list_values__item__success': true,
      'alpheios-features-select-block__list_values__item__failed': false,
      'fooName': true
    })

    expect(cmp.vm.featureItemClass({ value: 'fooValue', status: 'failed' }, 'fooName')).toEqual({
      'alpheios-features-select-block__list_values__item': true,
      'alpheios-features-select-block__list_values__item__success': false,
      'alpheios-features-select-block__list_values__item__failed': true,
      'fooName': true
    })
  })

  it('5 FeatureSelectBlock - selectFeature - emits selectFeature, incrementClicks, changes status for featureValue and executes checkIfFeatureAllValuesChosen if game is not finished', () => {
    cmp.vm.checkIfFeatureAllValuesChosen = jest.fn()

    cmp.vm.selectFeature(featureFullMatch.type, featureFullMatch)

    expect(cmp.emitted()['selectFeature']).toEqual([[featureFullMatch.type, 'success', featureFullMatch.value]])

    expect(cmp.emitted()['incrementClicks']).toEqual([[]])

    expect(cmp.vm.checkIfFeatureAllValuesChosen).toBeCalled()
  })

  it('6 FeatureSelectBlock - selectFeature - does nothing if game is finished', () => {
    cmp.vm.checkIfFeatureAllValuesChosen = jest.fn()
    cmp.setProps({
      finishGameFlag: true
    })

    cmp.vm.selectFeature(featureFullMatch.type, featureFullMatch)

    expect(cmp.emitted()['selectFeature']).toBeFalsy()
    expect(cmp.emitted()['incrementClicks']).toBeFalsy()
    expect(cmp.vm.checkIfFeatureAllValuesChosen).not.toBeCalled()
  })

  it('8 FeatureSelectBlock - checkIfFeatureAllValuesChosen - inits checkIfOnlyOneFeatureValueLeft (return true) and not inits checkIfChosenTheOnlyFeatureWithFullMatch', () => {
    cmp.vm.checkIfOnlyOneFeatureValueLeft = jest.fn(() => true)
    cmp.vm.checkIfChosenTheOnlyFeatureWithFullMatch = jest.fn()

    cmp.vm.selectFeature(featureFullMatch.type, featureFullMatch) // only one feature value left - tense(present) is chosen, imperfect left
    expect(cmp.vm.checkIfOnlyOneFeatureValueLeft).toHaveBeenCalledWith(featureFullMatch.type)
    expect(cmp.vm.checkIfChosenTheOnlyFeatureWithFullMatch).not.toBeCalled()
  })

  it('9 FeatureSelectBlock - checkIfFeatureAllValuesChosen - inits checkIfOnlyOneFeatureValueLeft (return false) and inits checkIfChosenTheOnlyFeatureWithFullMatch', () => {
    cmp.vm.checkIfOnlyOneFeatureValueLeft = jest.fn(() => false)
    cmp.vm.checkIfChosenTheOnlyFeatureWithFullMatch = jest.fn()

    cmp.vm.selectFeature(featureFullMatch.type, featureFullMatch) // only one feature value left - tense(present) is chosen, imperfect left
    expect(cmp.vm.checkIfOnlyOneFeatureValueLeft).toHaveBeenCalledWith(featureFullMatch.type)
    expect(cmp.vm.checkIfChosenTheOnlyFeatureWithFullMatch).toHaveBeenCalledWith(featureFullMatch.type)
  })

  it('10 FeatureSelectBlock - checkIfOnlyOneFeatureValueLeft - checks if there is only one feature unchecked - and checked it automatically', () => {
    expect(cmp.vm.checkIfOnlyOneFeatureValueLeft('type')).toBeFalsy() // for now no features are selected
    cmp.vm.featuresList.features['type'].find(feature => feature.value === 'regular').status = 'success' // select the first feature - only one is unchecked for now
    expect(cmp.vm.checkIfOnlyOneFeatureValueLeft('type')).toBeTruthy()
    expect(cmp.vm.featuresList.features['type'].find(feature => feature.value === 'irregular').status).toEqual('failed')
  })

  it('11 FeatureSelectBlock - checkIfChosenTheOnlyFeatureWithFullMatch - checks if there are only failed values are unchecked', () => {
    expect(cmp.vm.checkIfChosenTheOnlyFeatureWithFullMatch('type')).toBeFalsy() // for now no features are selected

    cmp.vm.featuresList.features['type'].find(feature => feature.value === 'regular').status = 'success' // select the first feature - only one is unchecked for now
    expect(cmp.vm.checkIfChosenTheOnlyFeatureWithFullMatch('type')).toBeTruthy()
    expect(cmp.vm.featuresList.features['type'].filter(feature => feature.value !== 'irregular').map(feature => feature.status)).toEqual(['success'])
  })
})

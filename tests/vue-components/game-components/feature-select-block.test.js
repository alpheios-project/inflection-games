/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { shallowMount, mount } from '@vue/test-utils'
import FeatureSelectBlock from '@/vue-components/game-components/feature-select-block.vue'

import { LanguageDatasetFactory as LDFAdapter } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Feature, Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('feature-select-block.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionData, testLocale, gameSet, testSelectedGame
  let featureFullMatch, featureNotFullMatch

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym('grc', 'συνδέει')
    testInflectionData = await LDFAdapter.getInflectionData(testHomonym)
    testLocale = 'en-US'

    featureFullMatch = new Feature('tense', 'present', Constants.LANG_GREEK)
    featureNotFullMatch = new Feature('number', 'dual', Constants.LANG_GREEK)
  })

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    gameSet = new GamesSet(testInflectionData, 'en-US')
    testSelectedGame = gameSet.gamesList['Guess inflection'][0]

    cmp = mount(FeatureSelectBlock, {
      propsData: {
        selectedGame: testSelectedGame,
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

  it('2 FeatureSelectBlock - featuresList - returns featuresList of the selectedGame and if defined then renders .alpheios-features-select-block ', () => {
    expect(cmp.vm.featuresList).toEqual(testSelectedGame.featuresList)
    expect(cmp.findAll('.alpheios-features-select-block').length).toEqual(1)

    cmp.setProps({
      selectedGame: {}
    })

    expect(cmp.vm.featuresList).toBeUndefined()
    expect(cmp.findAll('.alpheios-features-select-block').length).toEqual(0)
  })

  it('3 FeatureSelectBlock - featuresKeys - returns featuresListTitles of the selected game', () => {
    expect(cmp.vm.featuresKeys).toEqual(testSelectedGame.featuresListTitles)

    cmp.setProps({
      selectedGame: {}
    })

    expect(cmp.vm.featuresKeys).toBeUndefined()
  })

  it('4 FeatureSelectBlock - featureItemClass - returns classes depends on featureValue status', () => {
    expect(cmp.vm.featureItemClass({ value: 'fooValue', status: null })).toEqual({
      'alpheios-features-select-block__list_values__item': true,
      'alpheios-features-select-block__list_values__item__success': false,
      'alpheios-features-select-block__list_values__item__failed': false
    })

    expect(cmp.vm.featureItemClass({ value: 'fooValue', status: 'success' })).toEqual({
      'alpheios-features-select-block__list_values__item': true,
      'alpheios-features-select-block__list_values__item__success': true,
      'alpheios-features-select-block__list_values__item__failed': false
    })

    expect(cmp.vm.featureItemClass({ value: 'fooValue', status: 'failed' })).toEqual({
      'alpheios-features-select-block__list_values__item': true,
      'alpheios-features-select-block__list_values__item__success': false,
      'alpheios-features-select-block__list_values__item__failed': true
    })
  })

  it('5 FeatureSelectBlock - checkFeatureHasFullMatch - returns succes and failed depends on match', () => {
    expect(cmp.vm.checkFeatureHasFullMatch(featureFullMatch.type, featureFullMatch)).toEqual('success')
    expect(cmp.vm.checkFeatureHasFullMatch(featureNotFullMatch.type, featureNotFullMatch)).toEqual('failed')
  })

  it('6 FeatureSelectBlock - selectFeature - emits selectFeature, incrementClicks, changes status for featureValue and executes checkIfFeatureAllValuesChosen if game is not finished', () => {
    cmp.vm.checkIfFeatureAllValuesChosen = jest.fn()

    cmp.vm.selectFeature(featureFullMatch.type, featureFullMatch)

    expect(cmp.emitted()['selectFeature']).toEqual([[featureFullMatch.type, 'success', featureFullMatch.value]])

    expect(cmp.emitted()['incrementClicks']).toEqual([[]])

    expect(cmp.vm.checkIfFeatureAllValuesChosen).toBeCalled()
  })

  it('7 FeatureSelectBlock - selectFeature - does nothing if game is finished', () => {
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
    expect(cmp.vm.checkIfOnlyOneFeatureValueLeft('tense')).toBeFalsy() // for now no features are selected

    cmp.vm.featuresList['tense'].find(feature => feature.value === 'present').status = 'success' // select the first feature - only one is unchecked for now
    expect(cmp.vm.checkIfOnlyOneFeatureValueLeft('tense')).toBeTruthy()
    expect(cmp.vm.featuresList['tense'].find(feature => feature.value === 'imperfect').status).toEqual('failed')
  })

  it('11 FeatureSelectBlock - checkIfChosenTheOnlyFeatureWithFullMatch - checks if there are only failed values are unchecked', () => {
    expect(cmp.vm.checkIfChosenTheOnlyFeatureWithFullMatch('number')).toBeFalsy() // for now no features are selected

    cmp.vm.featuresList['number'].find(feature => feature.value === 'singular').status = 'success' // select the first feature - only one is unchecked for now
    expect(cmp.vm.checkIfChosenTheOnlyFeatureWithFullMatch('number')).toBeTruthy()
    expect(cmp.vm.featuresList['number'].filter(feature => feature.value !== 'singular').map(feature => feature.status)).toEqual(['failed', 'failed'])
  })
})

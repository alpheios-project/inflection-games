/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import Vue from 'vue/dist/vue'
import { shallowMount, mount } from '@vue/test-utils'
import SelectedGameBlock from '@/vue-components/selected-game-block.vue'

import { LanguageDatasetFactory as LDFAdapter } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Feature, Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('selected-game-block.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionData, testLocale, gameSet, testSelectedGame

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym(Constants.LANG_GREEK, 'συνδέει')
    testInflectionData = await LDFAdapter.getInflectionData(testHomonym)
    testLocale = 'en-US'
  })

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    gameSet = new GamesSet(testInflectionData, 'en-US')
    testSelectedGame = gameSet.gamesList['Guess inflection'][0]

    cmp = mount(SelectedGameBlock, {
      propsData: {
        selectedGame: testSelectedGame,
        selectedGameReady: false,
        changedGame: 0,
        failedGames: 0,
        successGames: 0
      }
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 SelectedGameBlock - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
  })

  it('2 SelectedGameBlock - featuresList returns featuresList from the selectedGame', () => {
    expect(cmp.vm.featuresList).toEqual(cmp.vm.selectedGame.featuresList)

    cmp.setProps({
      selectedGame: false
    })

    expect(cmp.vm.featuresList).toBeNull()
  })

  it('3 SelectedGameBlock - incrementClicks adds 1 to clicks and checks if clicks amount is greater than maxClicks,  if not greater than do nothing', () => {
    cmp.vm.incrementFailedGames = jest.fn()

    cmp.vm.maxClicks = 6
    cmp.vm.clicks = 1

    cmp.vm.incrementClicks()

    expect(cmp.vm.clicks).toEqual(2)
    expect(cmp.vm.incrementFailedGames).not.toBeCalled()
  })

  it('4 SelectedGameBlock - if after incrementClicks - clicks amount is greater than maxClicks, then finish the game with failed result', () => {
    cmp.vm.incrementFailedGames = jest.fn()

    cmp.vm.maxClicks = 6
    cmp.vm.clicks = 6

    cmp.vm.incrementClicks()

    expect(cmp.vm.incrementFailedGames).toBeCalled()
  })

  it('5 SelectedGameBlock - finishGame method changes finishGameFlag to true', () => {
    cmp.vm.finishGame()
    expect(cmp.vm.finishGameFlag).toBeTruthy()
  })

  it('6 SelectedGameBlock - incrementSuccessGames method adds 1 to successGames, defines gameResult as success and finishes the game', () => {
    cmp.vm.finishGame = jest.fn()

    cmp.vm.incrementSuccessGames()

    expect(cmp.emitted()['incrementSuccessGames']).toBeTruthy()
    expect(cmp.vm.finishGame).toBeCalled()
    expect(cmp.vm.gameResult).toEqual('success')
  })

  it('7 SelectedGameBlock - incrementFailedGames method adds 1 to failedGames, defines gameResult as failed and finishes the game', () => {
    cmp.vm.finishGame = jest.fn()

    cmp.vm.incrementFailedGames()

    expect(cmp.emitted()['incrementFailedGames']).toBeTruthy()
    expect(cmp.vm.finishGame).toBeCalled()
    expect(cmp.vm.gameResult).toEqual('failed')
  })

  it('8 SelectedGameBlock - selectFeature updates selectedFeature and selectedFeatureChange', () => {
    cmp.vm.selectedFeatureChange = 0

    cmp.vm.selectFeature('tense', 'success', 'present')

    expect(cmp.vm.selectedFeatureChange).toEqual(1)
    expect(cmp.vm.selectedFeature).toEqual({
      name: 'tense',
      status: 'success',
      value: 'present'
    })
  })

  it('9 SelectedGameBlock - if changedGame is changed arguments return to initial state', () => {
    cmp.vm.clicks = 4
    cmp.vm.finishGameFlag = true
    cmp.vm.selectedFeatureChange = 3
    cmp.vm.selectedFeature = {}
    cmp.vm.gameResult = 'success'
    cmp.vm.selectedGame = false

    cmp.setProps({
      changedGame: 2
    })

    expect(cmp.vm.clicks).toEqual(0)
    expect(cmp.vm.finishGameFlag).toBeFalsy()
    expect(cmp.vm.selectedFeatureChange).toEqual(0)
    expect(cmp.vm.selectedFeature).toBeFalsy()
    expect(cmp.vm.gameResult).toBeFalsy()
  })

  it('10 SelectedGameBlock - if changedGame and selectedGame is defined then clearGameStuff executes', () => {
    cmp.vm.selectedGame = testSelectedGame
    cmp.vm.selectedGame.clearGameStuff = jest.fn()

    cmp.setProps({
      changedGame: 2
    })

    expect(cmp.vm.selectedGame.clearGameStuff).toBeCalled()
  })
})

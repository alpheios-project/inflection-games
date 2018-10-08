/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import Vue from 'vue/dist/vue'
import { mount } from '@vue/test-utils'
import InflectionGameTable from '@/vue-components/game-components/inflection-game-table.vue'

import { ViewSetFactory } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Feature, Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('inflection-game-table.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionsViewSet, testLocale, gameSet, testSelectedGame

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym(Constants.LANG_LATIN, 'caeli')
    testLocale = 'en-US'
    testInflectionsViewSet = ViewSetFactory.create(testHomonym, testLocale)
  })

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    gameSet = new GamesSet(testInflectionsViewSet, testLocale)
    let gameType = InflectionGame.gameType
    let gameId = Object.values(gameSet.gamesList[gameType])[0].id

    testSelectedGame = gameSet.matchingGames[gameType][gameId]
    testSelectedGame.createGameStuff()

    cmp = mount(InflectionGameTable, {
      propsData: {
        selectedGame: testSelectedGame,
        finishGameFlag: false,
        selectedFeature: false,
        selectedFeatureChange: 0,
        featuresList: testSelectedGame.featuresList
      }
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 InflectionGameTable - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
  })

  it('2 InflectionGameTable - gameTable returns gameTable form selected game and renders alpheios-inflection-game-table', () => {
    expect(cmp.vm.gameTable).toBeDefined()
    expect(cmp.findAll('.alpheios-inflection-game-table').length).toEqual(1)

    cmp.setProps({
      selectedGame: {}
    })

    expect(cmp.vm.gameTable).toBeUndefined()
    expect(cmp.findAll('.alpheios-inflection-game-table').length).toEqual(0)
  })

  it('3 InflectionGameTable - showAllCells made all cells not hidden', () => {
    let allHiddenDataCells = cmp.vm.gameTable.rows.every(row => row.cells.filter(cell => cell.isDataCell).every(cell => cell.gameHidden))

    expect(allHiddenDataCells).toBeTruthy()

    cmp.vm.gameTable.showAllCells()

    let allNotHiddenDataCells = cmp.vm.gameTable.rows.every(row => row.cells.filter(cell => cell.isDataCell).every(cell => !cell.gameHidden))

    expect(allNotHiddenDataCells).toBeTruthy()
  })

  it('4 InflectionGameTable - on finishGame - showAllCells executes', () => {
    cmp.vm.gameTable.showAllCells = jest.fn()

    cmp.vm.finishGame()
    expect(cmp.vm.gameTable.showAllCells).toBeCalled()
  })

  it('5 InflectionGameTable - checkSuccessFeature - executes gameTable checkSuccessFeature', () => {
    cmp.vm.selectedFeature = { name: 'tense', value: 'present', status: 'success' }

    cmp.vm.gameTable.checkSuccessFeature = jest.fn()
    cmp.vm.checkSuccessFeature()

    expect(cmp.vm.gameTable.checkSuccessFeature).toHaveBeenCalled()
  })

  it('6 InflectionGameTable - checkFailedFeature - executes gameTable checkFailedFeature', () => {
    cmp.vm.selectedFeature = { name: 'number', value: 'dual', status: 'failed' }

    cmp.vm.gameTable.checkFailedFeature = jest.fn()
    cmp.vm.checkFailedFeature()

    expect(cmp.vm.gameTable.checkFailedFeature).toBeTruthy()
  })

  it('7 InflectionGameTable - checkIfLastUnCovered - if there are more than one cell is hidden - than nothing happens', () => {
    cmp.vm.finishGame = jest.fn()

    cmp.vm.checkIfLastUnCovered()

    expect(cmp.vm.finishGame).not.toBeCalled()
    expect(cmp.emitted()['incrementSuccessGames']).toBeFalsy()
  })

  it('8 InflectionGameTable - checkIfLastUnCovered - if there is only one cell is hidden - than the game is over with success', () => {
    cmp.vm.finishGame = jest.fn()

    cmp.vm.gameTable.rows.forEach(row => { row.cells.filter(cell => !cell.fullMatch).forEach(cell => { cell.gameHidden = false }) })
    cmp.vm.checkIfLastUnCovered()

    expect(cmp.vm.finishGame).toBeCalled()
    expect(cmp.emitted()['incrementSuccessGames']).toBeTruthy()
  })

  it('9 InflectionGameTable - when finishGameFlag becomes true finishGame executes', () => {
    cmp.vm.finishGame = jest.fn()
    cmp.setProps({
      finishGameFlag: true
    })
    expect(cmp.vm.finishGame).toBeCalled()
  })

  it('10 InflectionGameTable - when finishGameFlag becomes false nothing happens', () => {
    cmp.setProps({
      finishGameFlag: true
    })

    cmp.vm.finishGame = jest.fn()

    cmp.setProps({
      finishGameFlag: false
    })
    expect(cmp.vm.finishGame).not.toBeCalled()
  })

  it('11 InflectionGameTable - when selectedFeatureChange changes - if selectedFeature.status = success than checkSuccessFeature executes and checkIfLastUnCovered', () => {
    cmp.vm.checkSuccessFeature = jest.fn()
    cmp.vm.checkFailedFeature = jest.fn()
    cmp.vm.checkIfLastUnCovered = jest.fn()

    cmp.setProps({
      selectedFeature: { name: 'tense', value: 'present', status: 'success' },
      selectedFeatureChange: 1
    })
    expect(cmp.vm.checkSuccessFeature).toBeCalled()
    expect(cmp.vm.checkFailedFeature).not.toBeCalled()
    expect(cmp.vm.checkIfLastUnCovered).toBeCalled()
  })

  it('12 InflectionGameTable - when selectedFeatureChange changes - if selectedFeature.status = failed than checkFailedFeature executes and checkIfLastUnCovered', () => {
    cmp.vm.checkSuccessFeature = jest.fn()
    cmp.vm.checkFailedFeature = jest.fn()
    cmp.vm.checkIfLastUnCovered = jest.fn()

    cmp.setProps({
      selectedFeature: { name: 'tense', value: 'present', status: 'failed' },
      selectedFeatureChange: 2
    })

    expect(cmp.vm.checkSuccessFeature).not.toBeCalled()
    expect(cmp.vm.checkFailedFeature).toBeCalled()
    expect(cmp.vm.checkIfLastUnCovered).toBeCalled()
  })
})

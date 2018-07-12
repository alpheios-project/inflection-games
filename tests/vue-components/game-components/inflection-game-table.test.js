/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import Vue from 'vue/dist/vue'
import { shallowMount, mount } from '@vue/test-utils'
import InflectionGameTable from '@/vue-components/game-components/inflection-game-table.vue'

import { LanguageDatasetFactory as LDFAdapter } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Feature, Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('inflection-game-table.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionData, testLocale, gameSet, testSelectedGame

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym('grc', 'συνδέει')
    testInflectionData = await LDFAdapter.getInflectionData(testHomonym)
    testLocale = 'en-US'
  })

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    gameSet = new GamesSet(testInflectionData, 'en-US')
    testSelectedGame = gameSet.gamesList['Guess inflection'][0]

    cmp = mount(InflectionGameTable, {
      propsData: {
        selectedGame: testSelectedGame,
        finishGameFlag: false,
        selectedFeature: false,
        selectedFeatureChange: 0
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

  it('3 InflectionGameTable - cellClasses executes cellClassesLabel for labels', () => {
    cmp.vm.cellClassesLabel = jest.fn()
    cmp.vm.cellClassesData = jest.fn()

    cmp.vm.cellClasses({ role: 'label' })

    expect(cmp.vm.cellClassesLabel).toBeCalled()
    expect(cmp.vm.cellClassesData).not.toBeCalled()
  })

  it('4 InflectionGameTable - cellClasses executes cellClassesData for data', () => {
    cmp.vm.cellClassesLabel = jest.fn()
    cmp.vm.cellClassesData = jest.fn()

    cmp.vm.cellClasses({ role: 'data' })
    expect(cmp.vm.cellClassesLabel).not.toBeCalled()
    expect(cmp.vm.cellClassesData).toBeCalled()
  })

  it('5 InflectionGameTable - cellClassesData returns value depends on cells properties', () => {
    expect(cmp.vm.cellClassesData({ role: 'data', hidden: true, fullMatch: false })).toEqual({
      'infl-prdgm-tbl-cell--data': false,
      'infl-prdgm-tbl-cell--full-match': false
    })

    expect(cmp.vm.cellClassesData({ role: 'data', hidden: false, fullMatch: false })).toEqual({
      'infl-prdgm-tbl-cell--data': true,
      'infl-prdgm-tbl-cell--full-match': false
    })

    expect(cmp.vm.cellClassesData({ role: 'data', hidden: false, fullMatch: true })).toEqual({
      'infl-prdgm-tbl-cell--data': true,
      'infl-prdgm-tbl-cell--full-match': true
    })
  })

  it('6 InflectionGameTable - showAllCells made all cells not hidden', () => {
    let allHiddenDataCells = cmp.vm.gameTable.rows.every(row => row.cells.filter(cell => cell.role === 'data').every(cell => cell.hidden))

    expect(allHiddenDataCells).toBeTruthy()

    cmp.vm.showAllCells()

    let allNotHiddenDataCells = cmp.vm.gameTable.rows.every(row => row.cells.filter(cell => cell.role === 'data').every(cell => !cell.hidden))

    expect(allNotHiddenDataCells).toBeTruthy()
  })

  it('7 InflectionGameTable - on finishGame - showAllCells executes', () => {
    cmp.vm.showAllCells = jest.fn()

    cmp.vm.finishGame()
    expect(cmp.vm.showAllCells).toBeCalled()
  })

  it('8 InflectionGameTable - checkCell - executes only if cell is data and cell is hidden and game is not yet finished', () => {
    cmp.vm.checkCell({ role: 'label' })
    expect(cmp.emitted()['incrementClicks']).toBeFalsy()

    cmp.vm.checkCell({ role: 'data', hidden: false })
    expect(cmp.emitted()['incrementClicks']).toBeFalsy()

    cmp.vm.finishGameFlag = true
    cmp.vm.checkCell({ role: 'data', hidden: true })
    expect(cmp.emitted()['incrementClicks']).toBeFalsy()
  })

  it('9 InflectionGameTable - checkCell - emitts incrementClicks and make cell is not hidden (if not fullMatch)', () => {
    let testCell = { role: 'data', hidden: true }
    cmp.vm.checkCell(testCell)

    expect(cmp.emitted()['incrementClicks']).toBeTruthy()
    expect(testCell.hidden).toBeFalsy()

    expect(cmp.emitted()['incrementSuccessGames']).toBeFalsy()
  })

  it('10 InflectionGameTable - checkCell - emitts incrementSuccessGames and finishGame (if fullMatch)', () => {
    let testCell = { role: 'data', hidden: true, fullMatch: true }
    cmp.vm.finishGame = jest.fn()

    cmp.vm.checkCell(testCell)

    expect(cmp.emitted()['incrementSuccessGames']).toBeTruthy()
    expect(cmp.vm.finishGame).toBeCalled()
  })

  it('11 InflectionGameTable - checkSuccessFeature - made cells not hidden for other values', () => {
    cmp.vm.selectedFeature = { name: 'tense', value: 'present', status: 'success' }

    cmp.vm.checkSuccessFeature()
    let allShownCellsForOtherFeatureValues = cmp.vm.gameTable.rows.every(row =>
      row.cells.filter(cell => (cell.role === 'data' && cell['tense'] !== 'present'))
        .every(cell => !cell.hidden)
    )

    expect(allShownCellsForOtherFeatureValues).toBeTruthy()
  })

  it('12 InflectionGameTable - checkFailedFeature - made cells not hidden for this value', () => {
    cmp.vm.checkSuccessFeature = jest.fn()

    cmp.vm.selectedFeature = { name: 'number', value: 'dual', status: 'failed' }

    cmp.vm.checkFailedFeature()

    let allShownCellsForThisFeatureValue = cmp.vm.gameTable.rows.every(row =>
      row.cells.filter(cell => (cell.role === 'data' && cell['number'] === 'dual'))
        .every(cell => !cell.hidden)
    )

    expect(allShownCellsForThisFeatureValue).toBeTruthy()
  })

  it('13 InflectionGameTable - checkIfLastUnCovered - if there are more than one cell is hidden - than nothing happens', () => {
    cmp.vm.finishGame = jest.fn()

    cmp.vm.checkIfLastUnCovered()

    expect(cmp.vm.finishGame).not.toBeCalled()
    expect(cmp.emitted()['incrementSuccessGames']).toBeFalsy()
  })

  it('14 InflectionGameTable - checkIfLastUnCovered - if there is only one cell is hidden - than the game is over with success', () => {
    cmp.vm.finishGame = jest.fn()

    cmp.vm.gameTable.rows.forEach(row => { row.cells.filter(cell => !cell.fullMatch).forEach(cell => { cell.hidden = false }) })
    cmp.vm.checkIfLastUnCovered()

    expect(cmp.vm.finishGame).toBeCalled()
    expect(cmp.emitted()['incrementSuccessGames']).toBeTruthy()
  })

  it('14 InflectionGameTable - when finishGameFlag becomes true finishGame executes', () => {
    cmp.vm.finishGame = jest.fn()
    cmp.setProps({
      finishGameFlag: true
    })
    expect(cmp.vm.finishGame).toBeCalled()
  })

  it('15 InflectionGameTable - when finishGameFlag becomes false nothing happens', () => {
    cmp.setProps({
      finishGameFlag: true
    })

    cmp.vm.finishGame = jest.fn()

    cmp.setProps({
      finishGameFlag: false
    })
    expect(cmp.vm.finishGame).not.toBeCalled()
  })

  it('16 InflectionGameTable - when selectedFeatureChange changes - if selectedFeature.status = success than checkSuccessFeature executes and checkIfLastUnCovered', () => {
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

  it('17 InflectionGameTable - when selectedFeatureChange changes - if selectedFeature.status = failed than checkFailedFeature executes and checkIfLastUnCovered', () => {
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

/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { mount } from '@vue/test-utils'
import InflectionGameCell from '@/vue-components/game-components/inflection-game-cell.vue'

import { ViewSetFactory } from 'alpheios-inflection-tables'
import { ClientAdapters } from 'alpheios-client-adapters'
import { Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('inflection-game-cell.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionsViewSet, testLocale, gameSet, testSelectedGame

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
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 InflectionGameCell - cellClassesData returns value depends on cells properties', () => {
    let cmp1 = mount(InflectionGameCell, {
      propsData: {
        cell: { isDataCell: true, gameHidden: true, fullMatch: false, classes: {} }
      }
    })
    expect(cmp1.vm.cellClasses()).toEqual({
      'infl-cell--morph-match': false,
      'infl-data-cell': true,

      'infl-tbl-cell--data': false,
      'infl-tbl-cell--full-match': false
    })

    let cmp2 = mount(InflectionGameCell, {
      propsData: {
        cell: { isDataCell: true, gameHidden: false, fullMatch: false, classes: {} }
      }
    })
    expect(cmp2.vm.cellClasses()).toEqual({
      'infl-cell--morph-match': false,
      'infl-data-cell': true,

      'infl-tbl-cell--data': true,
      'infl-tbl-cell--full-match': false
    })

    let cmp3 = mount(InflectionGameCell, {
      propsData: {
        cell: { isDataCell: true, gameHidden: false, fullMatch: true, classes: {} }
      }
    })
    expect(cmp3.vm.cellClasses()).toEqual({
      'infl-cell--morph-match': false,
      'infl-data-cell': true,

      'infl-tbl-cell--data': false,
      'infl-tbl-cell--full-match': true
    })
  })

  it('2 InflectionGameCell - checkCell - executes only if cell is data and cell is hidden and game is not yet finished', () => {
    let cmp1 = mount(InflectionGameCell, {
      propsData: {
        cell: { isDataCell: false, classes: {} }
      }
    })
    cmp1.vm.checkCell()
    expect(cmp1.emitted()['incrementClicks']).toBeFalsy()

    let cmp2 = mount(InflectionGameCell, {
      propsData: {
        cell: { isDataCell: true, gameHidden: false, classes: {} }
      }
    })

    cmp2.vm.checkCell()
    expect(cmp2.emitted()['incrementClicks']).toBeFalsy()

    let cmp3 = mount(InflectionGameCell, {
      propsData: {
        cell: { isDataCell: true, gameHidden: true, classes: {} }
      }
    })

    cmp3.vm.finishGameFlag = true
    cmp3.vm.checkCell()
    expect(cmp3.emitted()['incrementClicks']).toBeFalsy()
  })

  it('3 InflectionGameCell - checkCell - emitts incrementClicks and make cell is not hidden (if not fullMatch)', () => {
    let testCell = { isDataCell: true, gameHidden: true, classes: {} }
    let cmp = mount(InflectionGameCell, {
      propsData: {
        cell: testCell
      }
    })
    cmp.vm.checkCell(testCell)

    expect(cmp.emitted()['incrementClicks']).toBeTruthy()
    expect(testCell.gameHidden).toBeFalsy()

    expect(cmp.emitted()['incrementSuccessGames']).toBeFalsy()
  })

  it('4 InflectionGameCell - checkCell - emitts incrementSuccessGames and finishGame (if fullMatch)', () => {
    let testCell = { isDataCell: true, gameHidden: true, classes: {}, fullMatch: true }
    let cmp = mount(InflectionGameCell, {
      propsData: {
        cell: testCell
      }
    })

    cmp.vm.checkCell(testCell)

    expect(cmp.emitted()['incrementSuccessGames']).toBeTruthy()
    expect(cmp.emitted()['finishGame']).toBeTruthy()
  })
})

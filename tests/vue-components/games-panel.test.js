/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import Vue from 'vue/dist/vue'

import { shallowMount, mount } from '@vue/test-utils'
import GamesPanel from '@/vue-components/games-panel.vue'
import GamesSet from '@/lib/games-set.js'

import { ViewSetFactory } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Constants } from 'alpheios-data-models'
import InflectionGame from '../../src/lib/games/inflection-game'

describe('games-panel.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionsViewSet, testLocale

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

    cmp = mount(GamesPanel, {
      propsData: {
        data: {},
        visible: false,
        slimHomonym: false
      },
      sync: false
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 GamePanel - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
    expect(cmp.vm.interactInstance).toBeUndefined()
  })

  it('2 GamePanel - defined interactInstance if data has draggable', () => {
    let cmp1 = mount(GamesPanel, {
      propsData: {
        data: { draggable: true },
        visible: false,
        slimHomonym: false
      },
      sync: false
    })
    expect(cmp1.vm.interactInstance).toBeDefined()
  })

  it('2 GamePanel - mainstyles depends on zIndex property', () => {
    expect(cmp.vm.mainstyles).toBeNull()

    cmp.setProps({ data: { zIndex: 2000 } })
    expect(cmp.vm.mainstyles).toEqual({ 'z-index': 2000 })
  })

  it('3 GamePanel - stylesForTooltipCloseIcon returns object with style properties', () => {
    expect(cmp.vm.stylesForTooltipCloseIcon).toBeInstanceOf(Object)
  })

  it('4 GamePanel - lexemesInHeader returns unique lexemes from homonym', () => {
    cmp.setProps({
      slimHomonym: testHomonym,
      data: {
        inflectionsViewSet: testInflectionsViewSet,
        hasMatchingViews: true,
        locale: testLocale
      }
    })
    expect(cmp.vm.slimHomonym.lexemes.length).toEqual(2)
    expect(cmp.vm.lexemesInHeader.length).toEqual(1) // because there are no definitions here
  })

  it('5 GamePanel - gamesSet returns gamesSet object if showInflectionsPanel are true, changes gamesListChanged and executes clearData', () => {
    cmp.setProps({
      data: {
        inflectionsViewSet: testInflectionsViewSet,
        hasMatchingViews: true,
        locale: testLocale
      }
    })

    expect(cmp.vm.gamesSet).toBeInstanceOf(GamesSet)
    expect(cmp.vm.gamesListChanged).toEqual(1)
  })

  it('6 GamePanel - definitionsFinal returns definitions if they are loaded or null while they are not loaded', () => {
    expect(cmp.vm.definitionsFinal).toBeFalsy()

    cmp.setProps({
      data: {
        definitions: { 'id1': ['fooDefinition'] },
        definitionsDataReady: true
      }
    })

    expect(cmp.vm.definitionsFinal).toEqual({ 'id1': ['fooDefinition'] })
  })

  it('7 GamePanel - showFeaturesPanel returns true if lexemes are loaded', () => {
    expect(cmp.vm.showFeaturesPanel).toBeFalsy()

    cmp.setProps({
      slimHomonym: testHomonym
    })

    expect(cmp.vm.showFeaturesPanel).toBeTruthy()
  })

  it('8 GamePanel - showInflectionsPanel returns true if lexemes are loaded', () => {
    expect(cmp.vm.showInflectionsPanel).toBeFalsy()

    cmp.setProps({
      data: {
        inflectionsViewSet: testInflectionsViewSet,
        hasMatchingViews: true,
        locale: testLocale
      }
    })

    expect(cmp.vm.showInflectionsPanel).toBeTruthy()
  })

  it('9 GamePanel - closePanel clearsData and emits close event', () => {
    cmp.vm.clearData = jest.fn()

    cmp.vm.closePanel()

    expect(cmp.vm.clearData).toBeCalled()
    expect(cmp.emitted()['close']).toBeTruthy()
  })

  it('10 GamePanel - selectedGameEvent changes - selectedGame, selectedGameReady, changedGame', () => {
    cmp.setProps({
      data: {
        inflectionsViewSet: testInflectionsViewSet,
        hasMatchingViews: true,
        locale: testLocale
      }
    })

    expect(cmp.vm.selectedGame).toBeFalsy()
    expect(cmp.vm.selectedGameReady).toBeFalsy()
    expect(cmp.vm.changedGame).toEqual(0)

    let gameType = InflectionGame.gameType
    let gameId = Object.values(cmp.vm.gamesSet.gamesList[gameType])[0].id
    let gameToSelect = cmp.vm.gamesSet.matchingGames[gameType][gameId]

    cmp.vm.selectedGameEvent(gameId, gameType)

    expect(cmp.vm.selectedGame).toEqual(gameToSelect)
    expect(cmp.vm.selectedGameReady).toBeTruthy()
    expect(cmp.vm.changedGame).toEqual(1)
  })

  it('11 GamePanel - clearData changes - selectedGame, selectedGameReady, changedGame to initial values', () => {
    cmp.setProps({
      data: {
        inflectionsViewSet: testInflectionsViewSet,
        hasMatchingViews: true,
        locale: testLocale
      }
    })

    let gameType = InflectionGame.gameType
    let gameId = Object.values(cmp.vm.gamesSet.gamesList[gameType])[0].id

    cmp.vm.selectedGameEvent(gameId, gameType)

    cmp.vm.clearData()

    expect(cmp.vm.selectedGame).toBeFalsy()
    expect(cmp.vm.selectedGameReady).toBeFalsy()
  })

  it('11 GamePanel - incrementSuccessGames adds 1 to successGames', () => {
    cmp.vm.successGames = 1

    cmp.vm.incrementSuccessGames()

    expect(cmp.vm.successGames).toEqual(2)
  })

  it('12 GamePanel - incrementFailedGames adds 1 to failedGames', () => {
    cmp.vm.failedGames = 1

    cmp.vm.incrementFailedGames()

    expect(cmp.vm.failedGames).toEqual(2)
  })

  it('13 GamePanel - if panel becomes visible, clearData is executed', async () => {
    cmp.vm.clearData = jest.fn()
    cmp.setProps({
      visible: false
    })

    await Vue.nextTick()
    expect(cmp.vm.clearData).not.toBeCalled()

    cmp.setProps({
      visible: true
    })

    await Vue.nextTick()
    expect(cmp.vm.clearData).toBeCalled()
  })
})

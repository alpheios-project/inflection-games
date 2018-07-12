/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import Vue from 'vue/dist/vue'

import { shallowMount, mount } from '@vue/test-utils'
import GamesPanel from '@/vue-components/games-panel.vue'
import GamesSet from '@/lib/games-set.js'

import { LanguageDatasetFactory as LDFAdapter } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'

describe('games-panel.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionData, testLocale

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

    cmp = shallowMount(GamesPanel, {
      propsData: {
        data: {},
        visible: false,
        homonym: false
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
  })

  it('2 GamePanel - mainstyles depends on zIndex property', () => {
    expect(cmp.vm.mainstyles).toBeNull()

    cmp.setProps({ data: { zIndex: 2000 } })
    expect(cmp.vm.mainstyles).toEqual({ 'z-index': 2000 })
  })

  it('3 GamePanel - stylesForTooltipCloseIcon returns object with style properties', () => {
    expect(cmp.vm.stylesForTooltipCloseIcon).toBeInstanceOf(Object)
  })

  it('4 GamePanel - gamesSet returns gamesSet object if inflectionData and locale are loaded, changes gamesListChanged and executes clearData', () => {
    expect(cmp.vm.gamesSet).toBeNull()
    expect(cmp.vm.gamesListChanged).toEqual(0)

    cmp.setProps({
      data: {
        inflectionData: testInflectionData,
        inflectionDataReady: true,
        locale: testLocale
      }
    })

    expect(cmp.vm.gamesSet).toBeInstanceOf(GamesSet)
    expect(cmp.vm.gamesListChanged).toEqual(1)
  })

  it('5 GamePanel - definitionsFinal returns definitions if they are loaded or null while they are not loaded', () => {
    expect(cmp.vm.definitionsFinal).toBeFalsy()

    cmp.setProps({
      data: {
        definitions: { 'id1': ['fooDefinition'] },
        definitionsDataReady: true
      }
    })

    expect(cmp.vm.definitionsFinal).toEqual({ 'id1': ['fooDefinition'] })
  })

  it('6 GamePanel - showFeaturesPanel returns true if lexemes are loaded', () => {
    expect(cmp.vm.showFeaturesPanel).toBeFalsy()

    cmp.setProps({
      homonym: testHomonym
    })

    expect(cmp.vm.showFeaturesPanel).toBeTruthy()
  })

  it('7 GamePanel - showInflectionsPanel returns true if lexemes are loaded', () => {
    expect(cmp.vm.showInflectionsPanel).toBeFalsy()

    cmp.setProps({
      data: {
        inflectionData: testInflectionData,
        inflectionDataReady: true,
        locale: testLocale
      }
    })

    expect(cmp.vm.showInflectionsPanel).toBeTruthy()
  })

  it('8 GamePanel - closePanel clearsData and emits close event', () => {
    cmp.vm.clearData = jest.fn()

    cmp.vm.closePanel()

    expect(cmp.vm.clearData).toBeCalled()
    expect(cmp.emitted()['close']).toBeTruthy()
  })

  it('9 GamePanel - selectedGameEvent changes - selectedGame, selectedGameReady, changedGame', () => {
    cmp.setProps({
      data: {
        inflectionData: testInflectionData,
        inflectionDataReady: true,
        locale: testLocale
      }
    })

    expect(cmp.vm.selectedGame).toBeFalsy()
    expect(cmp.vm.selectedGameReady).toBeFalsy()
    expect(cmp.vm.changedGame).toEqual(0)

    let gameToSelect = Object.values(cmp.vm.gamesSet.gamesList)[0]

    cmp.vm.selectedGameEvent(gameToSelect)

    expect(cmp.vm.selectedGame).toEqual(gameToSelect)
    expect(cmp.vm.selectedGameReady).toBeTruthy()
    expect(cmp.vm.changedGame).toEqual(1)
  })

  it('10 GamePanel - clearData changes - selectedGame, selectedGameReady, changedGame to initial values', () => {
    cmp.setProps({
      data: {
        inflectionData: testInflectionData,
        inflectionDataReady: true,
        locale: testLocale
      }
    })

    let gameToSelect = Object.values(cmp.vm.gamesSet.gamesList)[0]

    cmp.vm.selectedGameEvent(gameToSelect)

    cmp.vm.clearData()

    expect(cmp.vm.selectedGame).toBeFalsy()
    expect(cmp.vm.selectedGameReady).toBeFalsy()
  })
})

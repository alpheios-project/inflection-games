/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { shallowMount, mount } from '@vue/test-utils'
import InflectionViewsGames from '@/vue-components/header-components/inflection-views-games.vue'

import { LanguageDatasetFactory as LDFAdapter } from 'alpheios-inflection-tables'
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('inflection-views-games.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionData, testLocale, gameSet

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym(Constants.LANG_GREEK, 'συνδέει')
    testInflectionData = await LDFAdapter.getInflectionData(testHomonym)
    testLocale = 'en-US'

    gameSet = new GamesSet(testInflectionData, 'en-US')
  })

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    cmp = mount(InflectionViewsGames, {
      propsData: {
        gamesList: gameSet.gamesList,
        gamesListChanged: 0,
        selectedGameReady: false,
        selectedGame: false
      }
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 InflectionViewsGames - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
  })

  it('2 InflectionViewsGames - gamesListKeys returns games titles', () => {
    expect(cmp.vm.gamesListKeys).toEqual(['Guess inflection'])
  })

  it('3 InflectionViewsGames - inflectionViewsGamesTitle returns overal title', () => {
    expect(cmp.vm.inflectionViewsGamesTitle).toEqual('Games variants')

    cmp.setProps({
      gamesList: {}
    })

    expect(cmp.vm.inflectionViewsGamesTitle).toEqual('There are no game variants for selected homonym')
  })

  it('4 InflectionViewsGames - showHideVariantsLabel depends on showOnlySelected', () => {
    expect(cmp.vm.showOnlySelected).toBeFalsy()
    expect(cmp.vm.showHideVariantsLabel).toEqual('hide unselected')

    cmp.vm.showOnlySelected = true
    expect(cmp.vm.showHideVariantsLabel).toEqual('show all')
  })

  it('5 InflectionViewsGames - showHideVariants changes showOnlySelected only when there is at least one selected', () => {
    expect(cmp.vm.showOnlySelected).toBeFalsy()
    cmp.vm.showHideVariants()

    expect(cmp.vm.showOnlySelected).toBeFalsy()

    cmp.vm.selectedGameReady = true
    cmp.vm.showHideVariants()
    expect(cmp.vm.showOnlySelected).toBeTruthy()
  })

  it('6 InflectionViewsGames - checkHasSelectedChildren checks if there is any selected game in the type group', () => {
    expect(cmp.vm.checkHasSelectedChildren('fooKey')).toBeFalsy()
    expect(cmp.vm.checkHasSelectedChildren('Guess inflection')).toBeFalsy()

    cmp.vm.selectedId = gameSet.gamesList['Guess inflection'][0].id

    expect(cmp.vm.checkHasSelectedChildren('Guess inflection')).toBeTruthy()
  })

  it('7 InflectionViewsGames - selectGame updates selectedId and emits selectedGameEvent with selected game', () => {
    let testSelectedGame = gameSet.gamesList['Guess inflection'][0]

    cmp.vm.selectGame(testSelectedGame)

    expect(cmp.vm.selectedId).toEqual(testSelectedGame.id)
    expect(cmp.emitted()['selectedGameEvent']).toBeTruthy()

    expect(cmp.emitted()['selectedGameEvent'][0]).toEqual([testSelectedGame])
  })

  it('7 InflectionViewsGames - gamesListChanged has watch that returns selectedId and showOnlySelected to initial state', () => {
    let testSelectedGame = gameSet.gamesList['Guess inflection'][0]

    expect(cmp.vm.selectedId).toBeNull()
    expect(cmp.vm.showOnlySelected).toBeFalsy()

    cmp.vm.selectGame(testSelectedGame)
    cmp.vm.selectedGameReady = true

    cmp.vm.showHideVariants()

    expect(cmp.vm.selectedId).not.toBeNull()
    expect(cmp.vm.showOnlySelected).toBeTruthy()

    cmp.setProps({
      gamesListChanged: 1
    })

    expect(cmp.vm.selectedId).toBeNull()
    expect(cmp.vm.showOnlySelected).toBeFalsy()
  })
})

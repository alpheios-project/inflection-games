/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { mount } from '@vue/test-utils'
import InflectionViewsGames from '@/vue-components/header-components/inflection-views-games.vue'

import { ViewSetFactory } from 'alpheios-inflection-tables'
import { ClientAdapters } from 'alpheios-client-adapters'
import { Constants } from 'alpheios-data-models'

import GamesSet from '@/lib/games-set.js'
import InflectionGame from '@/lib/games/inflection-game.js'

describe('inflection-views-games.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionsViewSet, testLocale, gameSet

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
    expect(cmp.vm.inflectionViewsGamesTitle).toEqual('Select a game from the list:')

    cmp.setProps({
      gamesList: {}
    })

    expect(cmp.vm.inflectionViewsGamesTitle).toEqual('There are no game variants for selected homonym')
  })

  it('4 InflectionViewsGames - showHideVariantsLabel depends on showOnlySelected', () => {
    expect(cmp.vm.showOnlySelected).toBeFalsy()
    expect(cmp.vm.showHideVariantsLabel).toEqual('hide')

    cmp.vm.showOnlySelected = true
    expect(cmp.vm.showHideVariantsLabel).toEqual('show')
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
    let existedGameType = InflectionGame.gameType
    let existedGameId = Object.keys(gameSet.gamesList[existedGameType])[0]

    expect(cmp.vm.checkHasSelectedChildren('fooKey')).toBeFalsy()
    expect(cmp.vm.checkHasSelectedChildren(existedGameType)).toBeFalsy()

    cmp.vm.selectedId = gameSet.gamesList[existedGameType][existedGameId].id

    expect(cmp.vm.checkHasSelectedChildren(existedGameType)).toBeTruthy()
  })

  it('7 InflectionViewsGames - selectGame updates selectedId and emits selectedGameEvent with selected game', () => {
    let existedGameType = InflectionGame.gameType
    let existedGameId = Object.keys(gameSet.gamesList[existedGameType])[0]
    let testSelectedGame = gameSet.matchingGames[existedGameType][existedGameId]

    cmp.vm.selectGame(testSelectedGame)

    expect(cmp.vm.selectedId).toEqual(testSelectedGame.id)
    expect(cmp.emitted()['selectedGameEvent']).toBeTruthy()

    expect(cmp.emitted()['selectedGameEvent'][0]).toEqual([testSelectedGame.id, testSelectedGame.type])
  })

  it('8 InflectionViewsGames - gamesListChanged has watch that returns selectedId and showOnlySelected to initial state', () => {
    let existedGameType = InflectionGame.gameType
    let existedGameId = Object.keys(gameSet.gamesList[existedGameType])[0]

    let testSelectedGame = gameSet.matchingGames[existedGameType][existedGameId]

    expect(cmp.vm.selectedId).toBeNull()
    expect(cmp.vm.showOnlySelected).toBeFalsy()

    cmp.vm.selectGame(testSelectedGame)
    cmp.vm.selectedGameReady = true

    cmp.vm.showHideVariants()

    expect(cmp.vm.selectedId).not.toBeNull()

    cmp.setProps({
      gamesListChanged: 1
    })

    expect(cmp.vm.selectedId).toBeNull()
  })
})

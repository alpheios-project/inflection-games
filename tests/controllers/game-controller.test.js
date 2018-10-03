/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import GamesController from '@/controllers/games-controller.js'
import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'
import { Feature, Constants } from 'alpheios-data-models'

describe('games-controller.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let maAdapter, testHomonym

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym(Constants.LANG_LATIN, 'caeli')
  })

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 GamesController - new constructor without arguments creates gamesComponent with draggable = false', () => {
    let gC = new GamesController()
    expect(gC.gamesComponent).toBeInstanceOf(Vue)
    expect(gC.gamesComponent.gamesData).toBeInstanceOf(Object)

    expect(gC.gamesComponent.gamesData.draggable).toBeFalsy()
  })

  it('2 GamesController - new constructor with draggable === true creates gamesComponent with draggable = true', () => {
    let gC = new GamesController(true)
    expect(gC.gamesComponent.gamesData.draggable).toBeTruthy()
  })

  it('3 GamesController - open method (when game panel is not visible) - makes gamaeComponent.open() and visible=true', () => {
    let gC = new GamesController()

    expect(gC.gamesComponent.visible).toBeFalsy()
    jest.spyOn(gC.gamesComponent, 'open')

    gC.open()
    expect(gC.gamesComponent.open).toBeCalled()
    expect(gC.gamesComponent.visible).toBeTruthy()
  })

  it('4 GamesController - open method (when game panel is visible) - doesn\'t execute anything', () => {
    let gC = new GamesController()
    gC.gamesComponent.visible = true

    jest.spyOn(gC.gamesComponent, 'open')

    gC.open()
    expect(gC.gamesComponent.open).not.toBeCalled()
  })

  it('5 GamesController - close method (when game panel is visible) - makes gamaeComponent.close() and visible=false', () => {
    let gC = new GamesController()

    gC.gamesComponent.visible = true
    jest.spyOn(gC.gamesComponent, 'close')

    gC.close()
    expect(gC.gamesComponent.close).toBeCalled()
    expect(gC.gamesComponent.visible).toBeFalsy()
  })

  it('6 GamesController - close method (when game panel is not visible) - doesn\'t execute anything', () => {
    let gC = new GamesController()
    jest.spyOn(gC.gamesComponent, 'close')

    gC.close()
    expect(gC.gamesComponent.close).not.toBeCalled()
  })

  it('7 GamesController - updateLocale method - saves locale to gamesComponent', () => {
    let gC = new GamesController()
    expect(gC.gamesComponent.gamesData.locale).toBeNull()

    gC.updateLocale('fooLocale')
    expect(gC.gamesComponent.gamesData.locale).toEqual('fooLocale')
  })

  it('8 GamesController - updateHomonym method (panel is not visible) - saves homonym to gamesComponent and executes getInflectionDataFromHomonym', () => {
    let gC = new GamesController()
    expect(gC.gamesComponent.lexemes).toBeFalsy()

    gC.getInflectionViewSetDataFromHomonym = jest.fn()

    let testFeatures = {}
    testFeatures[Feature.types.part] = new Feature(Feature.types.part, 'noun', Constants.LANG_LATIN)

    let testLexeme = {
      lemma: {
        ID: 0,
        word: 'fooword',
        features: testFeatures
      }
    }

    let testHomonymL = { targetWord: 'fooword', lexemes: [testLexeme] }

    gC.updateHomonym(testHomonymL)

    expect(gC.gamesComponent.slimHomonym).toEqual({targetWord: 'fooword', lexemes: [{lemma: {ID: 0, partOfSpeech: 'noun', word: 'fooword'}}]})
    expect(gC.getInflectionViewSetDataFromHomonym).toBeCalled()
  })

  it('9 GamesController - updateHomonym method (panel is visible) - executes nothing', () => {
    let gC = new GamesController()
    gC.gamesComponent.visible = true

    gC.getInflectionDataFromHomonym = jest.fn()
    gC.updateHomonym('fooHomonym')

    expect(gC.gamesComponent.homonym).not.toEqual('fooHomonym')
    expect(gC.getInflectionDataFromHomonym).not.toBeCalled()
  })

  it('10 GamesController - updateDefinitions method - saves definitions from homonym and sets definitionsDataReady === true', () => {
    let gC = new GamesController()

    expect(gC.gamesComponent.gamesData.definitionsDataReady).toBeFalsy()
    expect(gC.gamesComponent.gamesData.definitions).toBeNull()

    gC.updateDefinitions({
      lexemes: [
        {
          lemma: { ID: 'l1' },
          meaning: {
            shortDefs: [{ text: 'fooDefinition' }]
          }
        }
      ]
    })

    expect(gC.gamesComponent.gamesData.definitionsDataReady).toBeTruthy()
    expect(gC.gamesComponent.gamesData.definitions).toEqual({ l1: ['fooDefinition'] })
  })

  it('11 GamesController - getInflectionViewSetDataFromHomonym method - creates ViewSetFactory and checkDisambiguatedLexemes', async () => {
    let gC = new GamesController()
    gC.checkDisambiguatedLexemes = jest.fn(() => testHomonym)

    gC.getInflectionViewSetDataFromHomonym(testHomonym)

    expect(gC.checkDisambiguatedLexemes).toHaveBeenCalled()
    expect(gC.gamesComponent.gamesData.inflectionsViewSet).toBeDefined()
    expect(gC.gamesComponent.gamesData.hasMatchingViews).toBeTruthy()
  })

  it('12 GamesController - checkDisambiguatedLexemes method - filters upon disambiguated property', async () => {
    let gC = new GamesController()

    expect(gC.checkDisambiguatedLexemes(testHomonym).lexemes.length).toEqual(2)

    testHomonym.lexemes[0].disambiguated = true

    expect(gC.checkDisambiguatedLexemes(testHomonym).lexemes.length).toEqual(1)
  })
})

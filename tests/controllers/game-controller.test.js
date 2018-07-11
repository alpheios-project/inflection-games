/* eslint-env jest */
/* eslint-disable no-unused-vars */
import GamesController from '@/controllers/games-controller.js'
import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration

describe('games-controller.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

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
    expect(gC.gamesComponent.homonym).toBeFalsy()

    gC.getInflectionDataFromHomonym = jest.fn()

    gC.updateHomonym('fooHomonym')

    expect(gC.gamesComponent.homonym).toEqual('fooHomonym')
    expect(gC.getInflectionDataFromHomonym).toBeCalled()
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

  it('11 GamesController - getInflectionDataFromHomonym method - executes getInflectionData from LDFAdapter and saves inflectionData, inflectionDataReady', async () => {
    let gC = new GamesController()
    gC.LDFAdapter.getInflectionData = jest.fn(() => 'fooInflectionData')

    expect(gC.gamesComponent.gamesData.inflectionData).toBeNull()
    expect(gC.gamesComponent.gamesData.inflectionDataReady).toBeFalsy()

    gC.getInflectionDataFromHomonym('fooHomonym')
    expect(gC.LDFAdapter.getInflectionData).toBeCalled()

    await Vue.nextTick()
    expect(gC.gamesComponent.gamesData.inflectionData).toEqual('fooInflectionData')
    expect(gC.gamesComponent.gamesData.inflectionDataReady).toBeTruthy()
  })

  it('12 GamesController - getInflectionDataFromHomonym method - catches Error and prints it to console', () => {
    let gC = new GamesController()
    gC.LDFAdapter.getInflectionData = jest.fn(() => { throw new Error('Foo error') })

    gC.getInflectionDataFromHomonym('fooHomonym')

    expect(console.error).toBeCalledWith(`LexicalQuery failed: Foo error`)
  })
})

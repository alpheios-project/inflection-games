/* eslint-env jest */
/* eslint-disable no-unused-vars */
import Game from '@/lib/game.js'

describe('game.test.js', () => {
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

  it('1 Game - new constructor with view that has partOfSpeech', () => {
    let game = new Game({ partOfSpeech: 'fooPartOfSpeach', id: 'fooId', name: 'fooName' })
    expect(game.partOfSpeech).toEqual('fooPartOfSpeach')
  })

  it('2 Game - new constructor with view that has partOfSpeech in paradigm property', () => {
    let game = new Game({ paradigm: { partOfSpeech: 'fooPartOfSpeach' }, id: 'fooId', name: 'fooName' })
    expect(game.partOfSpeech).toEqual('fooPartOfSpeach')
  })

  it('3 Game - new constructor no partOfSpeach in paradigm and in direct properties - returns empty partOfSpeach', () => {
    let game = new Game({ id: 'fooId', name: 'fooName' })
    expect(game.partOfSpeech).toBeNull()
  })
})

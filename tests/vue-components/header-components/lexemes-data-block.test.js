/* eslint-env jest */
/* eslint-disable no-unused-vars */
import 'whatwg-fetch'
import { shallowMount, mount } from '@vue/test-utils'
import LexemesDataBlock from '@/vue-components/header-components/lexemes-data-block.vue'
import DefinitionsBlock from '@/vue-components/header-components/definitions-block.vue'

import { AlpheiosTuftsAdapter } from 'alpheios-morph-client'

describe('lexemes-data-block.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp, maAdapter, testHomonym, testInflectionData, testLocale

  beforeAll(async () => {
    maAdapter = new AlpheiosTuftsAdapter()
    testHomonym = await maAdapter.getHomonym('grc', 'συνδέει')
  })

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    cmp = mount(LexemesDataBlock, {
      propsData: {
        lexemes: testHomonym.lexemes,
        definitions: false,
        definitionsReady: false
      }
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 LexemesDataBlock - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
    expect(cmp.findAll(DefinitionsBlock).length).toEqual(0)
    expect(cmp.vm.hidden).toBeFalsy()
  })

  it('2 LexemesDataBlock - renders DefinitionsBlock if definitions are loaded', () => {
    cmp.setProps({
      definitions: { 'id1': ['fooDefinition'] },
      definitionsDataReady: true
    })

    expect(cmp.findAll(DefinitionsBlock).length).toBeGreaterThan(0)
  })

  it('3 LexemesDataBlock - hiddenLabel depends on hidden property', () => {
    expect(cmp.vm.hidden).toBeFalsy()
    expect(cmp.vm.hiddenLabel).toEqual(expect.stringContaining('hide'))

    cmp.vm.hidden = true
    expect(cmp.vm.hiddenLabel).toEqual(expect.stringContaining('show'))
  })

  it('4 LexemesDataBlock - getDefinitions returns definition by lemmaID', () => {
    expect(cmp.vm.getDefinitions('id1')).toEqual([])

    cmp.setProps({
      definitions: { 'id1': ['fooDefinition'] },
      definitionsDataReady: true
    })

    expect(cmp.vm.getDefinitions('id1')).toEqual(['fooDefinition'])
    expect(cmp.vm.getDefinitions('id2')).toBeUndefined()
  })

  it('5 LexemesDataBlock - getPartOfSpeechFromLemma returns partOfSpeach', () => {
    expect(cmp.vm.getPartOfSpeechFromLemma(testHomonym.lexemes[0].lemma)).toEqual('verb')
    expect(cmp.vm.getPartOfSpeechFromLemma({})).toEqual('')
  })

  it('6 LexemesDataBlock - showHideLink changes hidden attribute', () => {
    expect(cmp.vm.hidden).toBeFalsy()

    cmp.vm.showHideLink()

    expect(cmp.vm.hidden).toBeTruthy()
  })
})

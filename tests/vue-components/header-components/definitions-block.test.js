/* eslint-env jest */
/* eslint-disable no-unused-vars */
import { shallowMount, mount } from '@vue/test-utils'
import DefinitionsBlock from '@/vue-components/header-components/definitions-block.vue'

describe('definitions-block.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    cmp = mount(DefinitionsBlock, {
      propsData: {
        definitions: []
      }
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 DefinitionsBlock - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
  })

  it('2 DefinitionsBlock - renders as a string if definitions has only one value', () => {
    cmp.setProps({
      definitions: ['fooDefinition']
    })

    expect(cmp.findAll('.alpheios-definitions-block__single').length).toEqual(1)
    expect(cmp.vm.singleDefinition).toEqual('fooDefinition')
    expect(cmp.find('.alpheios-definitions-block__single').text()).toEqual('fooDefinition')

    expect(cmp.findAll('.alpheios-definitions-block__multiple').length).toEqual(0)
  })

  it('3 DefinitionsBlock - renders as a list if definitions has several values', () => {
    cmp.setProps({
      definitions: ['fooDefinition1', 'fooDefinition2']
    })

    expect(cmp.findAll('.alpheios-definitions-block__multiple').length).toEqual(1)
    expect(cmp.findAll('.alpheios-definitions-block__multiple__item').at(0).text()).toEqual('fooDefinition1')
    expect(cmp.findAll('.alpheios-definitions-block__multiple__item').at(1).text()).toEqual('fooDefinition2')

    expect(cmp.findAll('.alpheios-definitions-block__single').length).toEqual(0)
  })
})

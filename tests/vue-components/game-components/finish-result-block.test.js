/* eslint-env jest */
/* eslint-disable no-unused-vars */
import { mount } from '@vue/test-utils'
import FinishResultBlock from '@/vue-components/game-components/finish-result-block.vue'

describe('finish-result-block.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    cmp = mount(FinishResultBlock, {
      propsData: {
        result: false
      }
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 FinishResultBlock - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
  })

  it('2 FinishResultBlock - resultLabel - Success or Failed', () => {
    expect(cmp.vm.resultLabel).toEqual('')

    cmp.setProps({
      result: 'success'
    })
    expect(cmp.vm.resultLabel).toEqual('Success')

    cmp.setProps({
      result: 'failed'
    })
    expect(cmp.vm.resultLabel).toEqual('Failed')
  })
})

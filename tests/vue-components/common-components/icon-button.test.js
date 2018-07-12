/* eslint-env jest */
/* eslint-disable no-unused-vars */
import { shallowMount, mount } from '@vue/test-utils'
import IconButton from '@/vue-components/common-components/icon-button.vue'
import TooltipWrap from '@/vue-components/common-components/tooltip-wrap.vue'

describe('icon-button.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    cmp = mount(IconButton, {
      propsData: {
        tooltipText: 'fooTiiltipText'
      }
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 IconButton - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
    expect(cmp.findAll(TooltipWrap).length).toEqual(1)
  })

  it('2 IconButton - emitEvent on click', () => {
    cmp.find('.alpheios-icon-button').trigger('click')
    expect(cmp.emitted()['iconClickEvent']).toBeTruthy()
  })
})

/* eslint-env jest */
/* eslint-disable no-unused-vars */
import { shallowMount, mount } from '@vue/test-utils'
import TooltipWrap from '@/vue-components/common-components/tooltip-wrap.vue'

describe('tooltip-wrap.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    cmp = mount(TooltipWrap, {
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

  it('1 TooltipWrap - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
    expect(cmp.find('.alpheios-tooltip__text')).toBeTruthy()
    expect(cmp.find('.alpheios-tooltip__text').text()).toEqual('fooTiiltipText')
  })

  it('2 TooltipWrap - tooltipDirectionLC returns formated tooltipDirection', () => {
    expect(cmp.vm.tooltipDirectionLC).toEqual('')

    cmp.setProps({
      tooltipDirection: 'BOttom'
    })

    expect(cmp.vm.tooltipDirectionLC).toEqual('bottom')
  })

  it('3 TooltipWrap - tooltipDirectionClass returns class for tooltip depends on tooltipDirection', () => {
    expect(cmp.vm.tooltipDirectionClass).toEqual('alpheios-tooltip__')
    cmp.setProps({
      tooltipDirection: 'right'
    })
    expect(cmp.vm.tooltipDirectionClass).toEqual('alpheios-tooltip__right')
  })

  it('4 TooltipWrap - finalTooltipDirection returns class for tooltip depends on tooltipDirection and allowedTooltipClasses and defaultTooltipClass', () => {
    expect(cmp.vm.finalTooltipDirection).toEqual(cmp.vm.defaultTooltipClass)

    cmp.setProps({
      tooltipDirection: 'right'
    })
    expect(cmp.vm.finalTooltipDirection).toEqual('alpheios-tooltip__right')

    cmp.setProps({
      tooltipDirection: 'fooDirection'
    })
    expect(cmp.vm.finalTooltipDirection).toEqual(cmp.vm.defaultTooltipClass)
  })
})

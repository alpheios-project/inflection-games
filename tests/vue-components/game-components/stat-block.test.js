/* eslint-env jest */
/* eslint-disable no-unused-vars */
import { shallowMount, mount } from '@vue/test-utils'
import StatBlock from '@/vue-components/game-components/stat-block.vue'

describe('stat-block.test.js', () => {
  console.error = function () {}
  console.log = function () {}
  console.warn = function () {}

  let cmp

  beforeEach(() => {
    jest.spyOn(console, 'error')
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')

    cmp = mount(StatBlock, {
      propsData: {
        clicks: 0,
        maxClicks: 0,
        failedGames: 0,
        successGames: 0
      }
    })
  })
  afterEach(() => {
    jest.resetModules()
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('1 StatBlock - renders a vue instance (min requirements)', () => {
    expect(cmp.isVueInstance()).toBeTruthy()
  })

  it('2 StatBlock - clicksClass depend on clicks and maxClicks', () => {
    cmp.setProps({
      clicks: 1, maxClicks: 6
    })

    expect(cmp.vm.clicksClass).toEqual({
      'alpheios-stat-block__smallColor': true,
      'alpheios-stat-block__mediumColor': false,
      'alpheios-stat-block__bigColor': false
    })

    cmp.setProps({
      clicks: 3, maxClicks: 6
    })
    expect(cmp.vm.clicksClass).toEqual({
      'alpheios-stat-block__smallColor': false,
      'alpheios-stat-block__mediumColor': true,
      'alpheios-stat-block__bigColor': false
    })

    cmp.setProps({
      clicks: 5, maxClicks: 6
    })
    expect(cmp.vm.clicksClass).toEqual({
      'alpheios-stat-block__smallColor': false,
      'alpheios-stat-block__mediumColor': false,
      'alpheios-stat-block__bigColor': true
    })
  })
})

// import { WideView } from 'alpheios-inflection-tables'

export default class Game {
  /* base class */
  constructor (view) {
    this.partOfSpeech = view.partOfSpeech
    this.id = view.id
    this.name = view.name
  }

  prerender () {
    this.view.morphemes = this.view.getMorphemes()
  }

  render () {
    this.view.render()
  }
}

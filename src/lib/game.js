export default class Game {
  /* base class */
  constructor (view) {
    this.partOfSpeech = view.partOfSpeech ? view.partOfSpeech : (view.paradigm ? view.paradigm.partOfSpeech : null)
    this.id = view.id
    this.name = view.name
  }
}

import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import GamesPanel from '@/vue-components/games-panel.vue'
import WindowServices from '@/lib/window-services.js'
import { ViewSetFactory } from 'alpheios-inflection-tables'
import { Feature, Homonym } from 'alpheios-data-models'

export default class GamesController {
  constructor (draggable) {
    this.gamesComponent = GamesController.gamesComponentCreate(draggable)
  }

  open () {
    if (!this.gamesComponent.visible) {
      this.gamesComponent.gamesData.zIndex = WindowServices.getZIndexMax()
      this.gamesComponent.open()
    }
  }

  close () {
    if (this.gamesComponent.visible) {
      this.gamesComponent.clearData()
      this.gamesComponent.close()
    }
  }

  updateHomonym (homonym) {
    if (!this.gamesComponent.visible) {
      this.gamesComponent.slimHomonym = {
        targetWord: homonym.targetWord,
        lexemes: homonym.lexemes.filter(lex => lex.lemma).map(lex => ({
          lemma: {
            ID: lex.lemma.ID,
            word: lex.lemma.word,
            partOfSpeech: lex.lemma.features ? lex.lemma.features[Feature.types.part].value : null
          }
        }))
      }
      this.getInflectionViewSetDataFromHomonym(homonym)
    }
  }

  updateLocale (locale) {
    this.gamesComponent.gamesData.locale = locale
  }

  updateDefinitions (homonym) {
    let definitions = {}
    homonym.lexemes.forEach(lex => {
      definitions[lex.lemma.ID] = []
      lex.meaning.shortDefs.forEach(item => { definitions[lex.lemma.ID].push(item.text) })
    })
    this.gamesComponent.gamesData.definitions = definitions
    this.gamesComponent.gamesData.definitionsDataReady = true
  }

  getInflectionViewSetDataFromHomonym (homonym) {
    let homonymFiltered = this.checkDisambiguatedLexemes(homonym)

    let locale = this.gamesComponent.gamesData.locale ? this.gamesComponent.gamesData.locale.currentValue : 'en-US'
    this.gamesComponent.gamesData.inflectionsViewSet = ViewSetFactory.create(homonymFiltered, locale)
    this.gamesComponent.gamesData.hasMatchingViews = this.gamesComponent.gamesData.inflectionsViewSet.hasMatchingViews
  }

  checkDisambiguatedLexemes (homonym) {
    let hasDisambiguated = homonym.lexemes.some(lex => lex.disambiguated)
    if (!hasDisambiguated) {
      return homonym
    } else {
      return new Homonym(homonym.lexemes.filter(lexeme => lexeme.disambiguated), this.targetWord)
    }
  }

  static gamesComponentCreate (draggable) {
    return new Vue({
      el: '#alpheios-games',
      components: {
        gamesPanel: GamesPanel
      },
      data: {
        currentGamesComponents: 'gamesPanel',
        visible: false,
        slimHomonym: false,
        gamesData: {
          draggable: draggable || false,
          zIndex: 4000,
          inflectionsViewSet: null,
          hasMatchingViews: false,
          locale: null,
          definitions: null,
          definitionsDataReady: false
        }
      },
      methods: {
        close: function () {
          this.visible = false
          return this
        },
        open: function () {
          this.visible = true
          return this
        },
        clearData: function () {
          this.slimHomonym = {}
          this.gamesData.inflectionsViewSet = null
          this.gamesData.hasMatchingViews = false
        }
      }
    })
  }
}

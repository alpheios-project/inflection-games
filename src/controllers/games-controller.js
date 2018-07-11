import Vue from 'vue/dist/vue' // Vue in a runtime + compiler configuration
import GamesPanel from '@/vue-components/games-panel.vue'
import WindowServices from '@/lib/window-services.js'
import { LanguageDatasetFactory as LDFAdapter } from 'alpheios-inflection-tables'

export default class GamesController {
  constructor (draggable) {
    this.gamesComponent = GamesController.gamesComponentCreate(draggable)
    this.LDFAdapter = LDFAdapter
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
      this.gamesComponent.homonym = homonym
      this.getInflectionDataFromHomonym(homonym)
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

  async getInflectionDataFromHomonym (homonym) {
    try {
      let inflectionData = await this.LDFAdapter.getInflectionData(homonym)
      this.gamesComponent.gamesData.inflectionData = inflectionData
      this.gamesComponent.gamesData.inflectionDataReady = true
    } catch (error) {
      console.error(`LexicalQuery failed: ${error.message}`)
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
        homonym: false,
        gamesData: {
          draggable: draggable || false,
          zIndex: 4000,
          inflectionData: null,
          inflectionDataReady: false,
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
          this.homonym = {}
          this.gamesData.inflectionData = null
          this.gamesData.inflectionDataReady = false
        }
      }
    })
  }
}

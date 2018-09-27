<template>
	<div class="alpheios-lexemes-data-block" :class="{ 'alpheios-lexemes-data-block__hidden': hidden}">
    
    <p class="alpheios-lexemes-data-block__title">
      Lexemes data
      <span 
        class = "alpheios-lexemes-data-block__show_link"
        @click = "showHideLink"
      > {{ hiddenLabel }}</span>
    </p>

    <ul class="alpheios-lexemes-data-block__list" v-show="!hidden">
      <li 
        class="alpheios-lexemes-data-block__list__item"
        v-for="(lex, indexLex) in lexemes" 
        :key="indexLex"
      >
        <span class="alpheios-lexemes-data-block__list__item__word">{{ lex.lemma.word }}</span>
        <span class="alpheios-lexemes-data-block__list__item__part_of_speech"> ({{ lex.lemma.partOfSpeech }})</span>
        <definitions-block
          v-if="definitionsDataReady"
          :definitions = "getDefinitions(lex.lemma.ID)"
        ></definitions-block>
      </li>
    </ul>

	</div>
</template>
<script>
  import DefinitionsBlock from '@/vue-components/header-components/definitions-block.vue'
  import { Feature } from 'alpheios-data-models'

  export default {
    name: 'LexemesDataBlock',
    components: {
      definitionsBlock: DefinitionsBlock
    },
    data () {
      return {
        hidden: false
      }
    },
    props: {
      lexemes: {
        type: Array,
        required: true
      },
      definitions: {
      	type: [Object, Boolean],
        required: true
      },
      definitionsDataReady: {
      	type: Boolean,
      	required: true
      },
      selectedGameReady: {
        type: Boolean,
      	required: false
      }
    },
    computed: {
      hiddenLabel () {
        return this.hidden ? 'show' : 'hide'
      }
    },
    watch: {
      selectedGameReady (value) {
        if (value) {
          this.hidden = true
        }
      }
    },
    methods: {
      getDefinitions (lemmaID) {
      	return this.definitionsDataReady ? this.definitions[lemmaID] : []
      },
      showHideLink () {
        this.hidden = !this.hidden
      }
    }
  }
</script>
<style  lang="scss" scoped>
  @import "../../styles/alpheios";

  .alpheios-lexemes-data-block {
    border: 1px solid $alpheios-sidebar-header-border-color;
    padding: 0 5px;
    margin: 20px 0 10px;
    font-size: 90%;
  }

  .alpheios-lexemes-data-block__title {
    display: inline-block;
    background: #fff;
    position: relative;
    top: -10px;
    margin: 0;
  }

  .alpheios-lexemes-data-block__list {
    margin: 0;
  }

  .alpheios-lexemes-data-block__list__item {
    margin-bottom: 5px;
    cursor: pointer;
  }

  .alpheios-lexemes-data-block__list__item__word {
    font-weight: bold;
  }

  .alpheios-lexemes-data-block__list__item__part_of_speech {
    color: $alpheios-toolbar-color;
  }

  .alpheios-lexemes-data-block__hidden {
    border: 0;
    padding: 0;
    margin: 20px 0 10px;
  }

  .alpheios-lexemes-data-block__show_link {
    font-weight: bold;
    color: $alpheios-link-color;
    display: inline-block;
    padding: 0 5px;
    cursor: pointer;
  }
</style>
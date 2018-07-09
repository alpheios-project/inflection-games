<template>
	<div class="alpheios-features-panel">
		<div class="alpheios-features-panel__lexemes" v-for="(lex, indexLex) in lexemes" :key="indexLex">
			<p class="alpheios-features-panel__lemma_word">
        {{lex.lemma.word}}<span> ({{ getPartOfSpeachFromLemma(lex.lemma) }})</span>
      </p>
      <definitions-panel
        v-if="definitionsDataReady"
        :definitions = "getDefinitions(lex.lemma.ID)"
      ></definitions-panel>
 		</div>
	</div>
</template>
<script>
  import DefinitionsPanel from '@/vue-components/lexeme-data-panels/definitions-panel.vue'
  import { Feature } from 'alpheios-data-models'

  export default {
    name: 'FeaturesPanel',
    components: {
      definitionsPanel: DefinitionsPanel
    },
    props: {
      lexemes: {
        type: Array,
        required: true
      },
      definitions: {
      	type: Object,
        required: true
      },
      definitionsDataReady: {
      	type: Boolean,
      	required: true
      }
    },
    methods: {
      extractFeatures (inflection) {
        return Object.values(inflection).filter(value => value && value.constructor && value.constructor.name === 'Feature')
      },
      getDefinitions (lemmaID) {
      	return this.definitionsDataReady ? this.definitions[lemmaID] : []
      },
      getPartOfSpeachFromLemma (lemma) {
        return lemma.features && lemma.features[Feature.types.part] ? lemma.features[Feature.types.part].value : ''
      }
    }
  }
</script>
<style  lang="scss">
  .alpheios-features-panel__lemma_word {
    display: inline-block;
    font-weight: bold;
    margin: 0 10px 0 0;
    vertical-align: top;
  }
</style>
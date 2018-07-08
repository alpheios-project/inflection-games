<template>
	<div class="alpheios-features-panel">
		<div class="alpheios-features-panel__lexemes" v-for="(lex, indexLex) in homonym.lexemes" :key="indexLex">
			<p class="alpheios-features-panel__lemma_word">{{lex.lemma.word}}</p>
      <definitions-panel
        v-if="definitionsDataReady"
        :definitions = "getDefinitions(lex.lemma.ID)"
      ></definitions-panel>
 		</div>
	</div>
</template>
<script>
  import DefinitionsPanel from '@/vue-components/lexeme-data-panels/definitions-panel.vue'

  export default {
    name: 'FeaturesPanel',
    components: {
      definitionsPanel: DefinitionsPanel
    },
    props: {
      homonym: {
        type: Object,
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
      	let features = []
      	Object.keys(inflection).forEach(function(key,index) {
      	  if (inflection[key] && inflection[key].constructor && inflection[key].constructor.name === 'Feature') {
      	  	features.push(inflection[key])
      	  }
      	})
      	return features
      },
      getDefinitions (lemmaID) {
      	if (this.definitionsDataReady) {
      	  return this.definitions[lemmaID]
      	}
      	return []
      }
    }
  }
</script>
<style  lang="scss">
  .alpheios-features-panel__lemma_word {
    display: inline-block;
    font-weight: bold;
    margin: 10px 10px 10px 0;
    vertical-align: top;
  }
</style>
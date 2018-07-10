<template>
	<div class="alpheios-definitions-block">
		<p 	
			v-if = "definitions.length === 1"
			class = "alpheios-definitions-block__single"
		>{{ singleDefinition }}</p>

		<ul 
			v-if = "definitions.length > 1"
			class = "alpheios-definitions-block__multiple"
		>
			<li 
				v-for = "(definition, indexD) in definitions" 
				:key = "indexD"
				class = ""alpheios-definitions-block__multiple__item"
			>{{ definition }}</li>
		</ul>
	</div>
</template>
<script>
  export default {
    name: 'DefinitionsBlock',
    props: {
      definitions: {
      	type: Array,
        required: true
      }
    },
    computed: {
      singleDefinition: function () {
      	return this.definitions[0]
      }
    }
  }
</script>
<style  lang="scss" scoped>
	.alpheios-definitions-block {
	  display: inline-block;
	  vertical-align: top;
	}

	.alpheios-definitions-block__single {
	  margin: 0;
	}
	.alpheios-definitions-block__multiple {
	  margin: 0;
      padding-left: 20px;
	}
</style>
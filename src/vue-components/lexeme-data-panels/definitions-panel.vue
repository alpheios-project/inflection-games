<template>
	<div class="alpheios-definitions-panel">
		<p 	
			v-if = "definitions.length === 1"
			class = "alpheios-definitions-panel__item"
		>{{ definitions[0] }}</p>

		<ul 
			v-if = "definitions.length > 1"
			class = "alpheios-definitions-panel__definitions_list"
		>
			<li 
				v-for = "(definition, indexD) in definitions" 
				:key = "indexD"
				class = "alpheios-definitions-panel__item"
			>{{ definition }}</li>
		</ul>
	</div>
</template>
<script>
  export default {
    name: 'DefinitionsPanel',
    props: {
      definitions: {
      	type: Array,
        required: true
      }
    },
    methods: {
    }
  }
</script>
<style  lang="scss">
	.alpheios-definitions-panel {
	  display: inline-block;
	  vertical-align: top;
	}

	.alpheios-definitions-panel__item {
	  margin: 0;
	}
	.alpheios-definitions-panel__definitions_list {
	  margin: 0;
      padding-left: 20px;
	}
</style>
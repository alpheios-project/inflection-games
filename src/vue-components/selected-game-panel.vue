<template>
	<div class = "alpheios-selected_game_panel">

		<p class = "alpheios-selected_game_panel__selected_game__heading">{{ selectedGameTitle }}</p>
		<div 
			v-if = "selectedGameVariantReady"
			class = "alpheios-selected_game_panel__selected_game"
		>
			<main-table-wide :data="selectedView.wideTable" :inflection-data="selectedView.inflectionData"></main-table-wide>
		</div>
	</div>
</template>
<script>
  import WideTable from '@/vue-components/inflection-games-panels/wide-table.vue'
  export default {
    name: 'SelectedGamePanel',
    components: {
      mainTableWide: WideTable
    },
    props: {
      selectedGameVariantReady: {
        type: Boolean,
        required: true
      },
      selectedGameVariant: {
        type: Object,
        required: true
      }
    },
    computed: {
      selectedGameTitle: function () {
      	if (!this.selectedGameVariantReady) {
      	  return 'Select game from upper panel'
      	} else {
      	  return `Selected game - ${this.selectedGameVariant.partOfSpeach} - ${this.selectedGameVariant.view.name}`
      	}

      },
      selectedView: function () {
      	if (this.selectedGameVariantReady) {
      	  return this.selectedGameVariant.view
      	}
      	return null
      }
    },
    methods: {
    }
  }
</script>
<style  lang="scss">
	.alpheios-selected_game_panel__selected_game__heading {
		font-weight: bold;
	}
</style>
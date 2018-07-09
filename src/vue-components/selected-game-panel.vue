<template>
	<div class = "alpheios-selected_game_panel">

		<p class = "alpheios-selected_game_panel__selected_game__heading">{{ selectedGameTitle }}</p>
		<div 
			v-if = "selectedGameVariantReady"
			class = "alpheios-selected_game_panel__selected_game"
		>
      <stat-panel :clicks="clicks" :maxClicks="maxClicks"></stat-panel>
			<inflection-table-panel 
        :data="selectedView.wideTable" 
        :inflection-data="selectedView.inflectionData"

        :changedGame = "changedGame"
        :finishGameFlag = "finishGameFlag"

        :clicks = "clicks"
        @incrementClick = "incrementClick"
      ></inflection-table-panel>
		</div>
	</div>
</template>
<script>
  import InflectionTablePanel from '@/vue-components/inflection-games-panels/inflection-table-panel.vue'
  import StatPanel from '@/vue-components/inflection-games-panels/stat-panel.vue'

  export default {
    name: 'SelectedGamePanel',
    components: {
      inflectionTablePanel: InflectionTablePanel,
      statPanel: StatPanel
    },
    data () {
      return {
        clicks: 0,
        maxClicks: 6,
        finishGameFlag: false
      }
    },
    props: {
      selectedGameVariantReady: {
        type: Boolean,
        required: true
      },
      selectedGameVariant: {
        type: Object,
        required: true
      },
      changedGame: {
        type: Number,
        required: true
      }
    },
    computed: {
      homonym: function () {
      	return this.selectedGameVariantReady ? this.selectedGameVariant.view.inflectionData.homonym : null
      },
      selectedGameTitle: function () {
      	if (!this.selectedGameVariantReady) {
      	  return 'Select game from upper panel'
      	} else {
      	  return `Selected game - ${this.selectedGameVariant.partOfSpeach} - ${this.selectedGameVariant.view.name}`
      	}

      },
      selectedView: function () {
      	return this.selectedGameVariantReady ? this.selectedGameVariant.view : null
      }
    },
    methods: {
      incrementClick: function () {
        this.clicks = this.clicks + 1
        if (this.clicks > this.maxClicks) {
          this.finishGame()
        }
      },
      finishGame: function () {
        this.finishGameFlag = true
      }
    },
    watch: {
      changedGame: function () {
        this.clicks = 0
        this.finishGameFlag = false
      }
    }
  }
</script>
<style  lang="scss">
	.alpheios-selected_game_panel__selected_game__heading {
		font-weight: bold;
	}
</style>
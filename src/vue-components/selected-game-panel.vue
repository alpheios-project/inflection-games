<template>
	<div class = "alpheios-selected_game_panel">

		<p class = "alpheios-selected_game_panel__selected_game__heading">{{ selectedGameTitle }}</p>
		<div 
			v-if = "selectedGameVariantReady"
			class = "alpheios-selected_game_panel__selected_game"
		>
      <stat-panel 
        :clicks = "clicks"
        :maxClicks = "maxClicks"
        :failedGames = "failedGames"
        :successGames = "successGames"
      ></stat-panel>

      <div :class = "{ 'alpheios-selected_game_panel__game': true, 'alpheios-selected_game_panel__has_featureblock': featuresList }" >
        <feature-select-panel 
          v-if = "featuresList"

          :featuresList = "featuresList"
          :featuresListChanged = "featuresListChanged"

          :gameTable = "selectedView.wideTable"
          :inflection-data = "selectedView.inflectionData"

          @selectFeature = selectFeature
          @incrementClicks = "incrementClicks"
        ></feature-select-panel>

  			<inflection-table-panel 
          :data = "selectedView.wideTable" 
          :inflection-data = "selectedView.inflectionData"

          :changedGame = "changedGame"
          :finishGameFlag = "finishGameFlag"

          :clicks = "clicks"
          @incrementClicks = "incrementClicks"
          @incrementSuccessGames = "incrementSuccessGames"
          @incrementFailedGames = "incrementFailedGames"

          :selectedFeature = "selectedFeature"
          :selectedFeatureChange = "selectedFeatureChange"
        ></inflection-table-panel>

        <finish-result-panel
          :result = "gameResult"
        ></finish-result-panel>

      </div><!--alpheios-selected_game_panel__has_featureblock-->
    
		</div>
	</div>
</template>
<script>
  import InflectionTablePanel from '@/vue-components/inflection-games-panels/inflection-table-panel.vue'
  import StatPanel from '@/vue-components/inflection-games-panels/stat-panel.vue'
  import FeatureSelectPanel from '@/vue-components/inflection-games-panels/feature-select-panel.vue'
  import FinishResultPanel from '@/vue-components/inflection-games-panels/finish-result-panel.vue'

  export default {
    name: 'SelectedGamePanel',
    components: {
      inflectionTablePanel: InflectionTablePanel,
      statPanel: StatPanel,
      featureSelectPanel: FeatureSelectPanel,
      finishResultPanel: FinishResultPanel
    },
    data () {
      return {
        clicks: 0,
        maxClicks: 6,
        finishGameFlag: false,
        failedGames: 0,
        successGames: 0,
        featuresListChanged: 0,
        selectedFeature: false,
        selectedFeatureChange: 0,
        gameResult: false
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
      },
      featuresList: function () {
        let featuresListC = {}

        this.selectedGameVariant.view.wideTable.rows.forEach(row => {
          row.cells.forEach(cell => {
            if (cell.role === 'data') {
              let cellFeatures = this.getFeatures(cell)
              cellFeatures.forEach(feature => {
                if (featuresListC[feature] === undefined) {
                  featuresListC[feature] = []
                }
                if (featuresListC[feature].indexOf(cell[feature]) === -1) {
                  featuresListC[feature].push(cell[feature])
                }
              })
            }
          })
        })
        this.featuresListChanged = this.featuresListChanged + 1
        return featuresListC
      }
    },
    methods: {
      incrementClicks: function () {
        this.clicks = this.clicks + 1
        if (this.clicks > this.maxClicks) {
          this.incrementFailedGames()
          this.finishGame()
        }
      },
      finishGame: function () {
        this.finishGameFlag = true
      },
      incrementSuccessGames: function () {
        this.successGames = this.successGames + 1
        this.gameResult = 'success'
      },
      incrementFailedGames: function () {
        this.failedGames = this.failedGames + 1
        this.gameResult = 'failed'
      },
      getFeatures: function (cell) {
        let ignoreProps = ['role', 'value', 'hidden', 'fullMatch']
        return Object.keys(cell).filter(prop => (ignoreProps.indexOf(prop) === -1))
      },
      selectFeature: function (featureName, featureStatus, featureValue) {
        this.selectedFeature = {
          name: featureName,
          status: featureStatus,
          value: featureValue
        }
        this.selectedFeatureChange = this.selectedFeatureChange + 1
      }
    },
    watch: {
      changedGame: function () {
        this.clicks = 0
        this.finishGameFlag = false
        this.selectedFeatureChange = 0,
        this.selectedFeature = false
        this.gameResult = false
      }
    }
  }
</script>
<style  lang="scss">
	.alpheios-selected_game_panel__selected_game__heading {
		font-weight: bold;
	}
  .alpheios-selected_game_panel__has_featureblock .alpheios-games-panel__wide_table {
    margin-left: 155px;
  }

  .alpheios-selected_game_panel__has_featureblock:before,
  .alpheios-selected_game_panel__has_featureblock:after {
    clear: both;
    display: table;
    content: '';
  }

  .alpheios-selected_game_panel__game {
    position: relative;
    overflow: hidden;
  }
</style>
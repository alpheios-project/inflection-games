<template>
	<div class = "alpheios-selected-game-block">

		<p class = "alpheios-selected-game-block__title">{{ selectedGameTitle }}</p>
		<div 
			v-if = "selectedGameReady"
			class = "alpheios-selected-game-block__game_wrap"
		>
      <stat-block 
        :clicks = "clicks"
        :maxClicks = "maxClicks"
        :failedGames = "failedGames"
        :successGames = "successGames"
      ></stat-block>

      <div :class = "{ 'alpheios-selected-game-block__game_layout': true, 'alpheios-selected-game-block__has_featureblock': featuresList }" >
        <feature-select-block 
          v-if = "featuresList"

          :selectedGame = "selectedGame"

          @selectFeature = selectFeature
          @incrementClicks = "incrementClicks"
        ></feature-select-block>

   			<inflection-game-table
          :selectedGame = "selectedGame"

          :finishGameFlag = "finishGameFlag"

          :clicks = "clicks"
          @incrementClicks = "incrementClicks"
          @incrementSuccessGames = "incrementSuccessGames"
          @incrementFailedGames = "incrementFailedGames"

          :selectedFeature = "selectedFeature"
          :selectedFeatureChange = "selectedFeatureChange"
        ></inflection-game-table>

        <finish-result-block
          :result = "gameResult"
        ></finish-result-block>

      </div>
    
		</div>
	</div>
</template>
<script>
  import InflectionGameTable from '@/vue-components/game-components/inflection-game-table.vue'
  import StatBlock from '@/vue-components/game-components/stat-block.vue'
  import FeatureSelectBlock from '@/vue-components/game-components/feature-select-block.vue'
  import FinishResultBlock from '@/vue-components/game-components/finish-result-block.vue'

  export default {
    name: 'SelectedGameBlock',
    components: {
      inflectionGameTable: InflectionGameTable,
      statBlock: StatBlock,
      featureSelectBlock: FeatureSelectBlock,
      finishResultBlock: FinishResultBlock
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
      selectedGameReady: {
        type: Boolean,
        required: true
      },
      selectedGame: {
        type: Object,
        required: true
      }
    },
    computed: {
      selectedGameTitle: function () {
      	if (!this.selectedGameReady) {
      	  return 'Select game from upper panel'
      	} else {
      	  return `Selected game - ${this.selectedGame.partOfSpeech} - ${this.selectedGame.name}`
      	}

      },
      selectedView: function () {
      	return this.selectedGameReady ? this.selectedGame.view : null
      },
      featuresList: function () {
        this.featuresListChanged = this.featuresListChanged + 1
        return this.selectedGame.featuresList
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
	.alpheios-selected-game-block__title {
		font-weight: bold;
	}
  .alpheios-selected-game-block__has_featureblock .alpheios-inflection-game-table {
    margin-left: 155px;
  }

  .alpheios-selected-game-block__has_featureblock:before,
  .alpheios-selected-game-block__has_featureblock:after {
    clear: both;
    display: table;
    content: '';
  }

  .alpheios-selected-game-block__game_layout {
    position: relative;
    overflow: hidden;
  }
</style>
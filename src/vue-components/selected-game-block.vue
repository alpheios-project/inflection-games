<template>
	<div class = "alpheios-selected-game-block">
		<div 
			v-if = "selectedGameReady"
			class = "alpheios-selected-game-block__game_wrap"
		>
      <feature-select-block 
        v-if = "hasFeaturedBlock"

        :featuresList = "featuresList"
        :finishGameFlag = "finishGameFlag"

        @selectFeature = selectFeature
        @incrementClicks = "incrementClicks"
      ></feature-select-block>

      <div :class = "{ 'alpheios-selected-game-block__game_layout': true, 'alpheios-selected-game-block__has_featureblock': hasFeaturedBlock }" >
        <stat-block 
          :clicks = "clicks"
          :maxClicks = "maxClicks"
          :failedGames = "failedGames"
          :successGames = "successGames"
          @restartScoreGame = "restartScoreGame"
        ></stat-block>

   			<inflection-game-table
          :selectedGame = "selectedGame"

          :finishGameFlag = "finishGameFlag"

          :clicks = "clicks"
          @incrementClicks = "incrementClicks"
          @incrementSuccessGames = "incrementSuccessGames"
          @incrementFailedGames = "incrementFailedGames"

          :selectedFeature = "selectedFeature"
          :selectedFeatureChange = "selectedFeatureChange"
          :featuresList = "featuresList"
        ></inflection-game-table>

        <finish-result-block
          :result = "gameResult"
          @restartGame = "restartGame"
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
        featuresListChanged: 0,
        selectedFeature: false,
        selectedFeatureChange: 0,
        featureListByName: false,
        gameResult: false
      }
    },
    props: {
      selectedGameReady: {
        type: Boolean,
        required: true
      },
      selectedGame: {
        type: [Object, Boolean],
        required: true
      },
      changedGame: {
        type: Number,
        required: true
      },
      failedGames: {
        type: Number,
        required: true
      },
      successGames: {
        type: Number,
        required: true
      },
      hardMode: {
        type: Boolean,
        required: false,
        dafault: false
      }
    },
    computed: {
      featuresList () {
        this.featuresListChanged = this.featuresListChanged + 1
        return this.selectedGame && this.selectedGame.featuresList ? this.selectedGame.featuresList : null
      },
      hasFeaturedBlock () {
        return !this.hardMode && this.featuresList
      }
    },
    methods: {
      incrementClicks () {
        this.clicks = this.clicks + 1
        if (this.clicks >= this.maxClicks) {
          this.incrementFailedGames()
        }
      },
      finishGame () {
        this.finishGameFlag = true
      },
      incrementSuccessGames () {
        this.$emit('incrementSuccessGames')
        this.gameResult = 'success'
        this.finishGame()
      },
      incrementFailedGames () {
        this.$emit('incrementFailedGames')
        this.gameResult = 'failed'
        this.finishGame()
      },
      restartGame () {
        this.$emit('restartGame')
      },
      restartScoreGame () {
        this.$emit('restartScoreGame')
      },
      selectFeature (featureName, featureStatus, featureValue) {
        this.selectedFeature = {
          name: featureName,
          status: featureStatus,
          value: featureValue
        }
        this.selectedFeatureChange = this.selectedFeatureChange + 1
      }
    },
    watch: {
      changedGame () {
        this.clicks = 0
        this.finishGameFlag = false
        this.selectedFeatureChange = 0,
        this.selectedFeature = false
        this.gameResult = false
        if (this.selectedGame) {
          this.selectedGame.clearGameStuff()  
        }
        
      }
    }
  }
</script>
<style  lang="scss">
  .alpheios-selected-game-block {
    /* overflow: auto; */
  }
  
	.alpheios-selected-game-block__title {
		font-weight: bold;
	}
  .alpheios-selected-game-block__has_featureblock .alpheios-inflection-game-table {
    margin-left: 10px;
    padding-right: 10px;
    overflow: auto;
  }

  .alpheios-selected-game-block__game_wrap:before,
  .alpheios-selected-game-block__game_wrap:after {
    clear: both;
    display: table;
    content: '';
  }

  .alpheios-features-select-block {
  	display: block;
    width: 150px;
    float: left;
  }

  .alpheios-selected-game-block__game_layout {
    position: relative;
    overflow: auto;
  }

  .alpheios-selected-game-block__has_featureblock.alpheios-selected-game-block__game_layout {
    margin-left: 160px;
  }
</style>
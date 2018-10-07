<template>
    <div class="alpheios-inflection-game-table" v-if="gameTable">
        <div :style="selectedGame.view.wideView.style" :class="gameTable.tableClasses">
            <template v-for="row in gameTable.rows">
              <div v-if="row.classes" :class="row.classes">
                <inflection-game-cell 
                  v-for = "(cell, index) in row.cells" 
                  :key="index"
                  :cell="cell"
                  @finishGame = "finishGame"
                  @incrementClicks = "incrementClicks"
                  @incrementSuccessGames = "incrementSuccessGames"
                  ></inflection-game-cell>
              </div>
              <inflection-game-cell v-else 
                v-for = "cell in row.cells" 
                :key="cell._index"
                :cell="cell"
                @finishGame = "finishGame"
                @incrementClicks = "incrementClicks"
                @incrementSuccessGames = "incrementSuccessGames"
              ></inflection-game-cell>
            </template>
        </div>
    </div>
</template>
<script>
  import Vue from 'vue/dist/vue'
  import InflectionGameCell from '@/vue-components/game-components/inflection-game-cell.vue'

  export default {
    name: 'InflectionGameTable',
    components: {
      inflectionGameCell: InflectionGameCell
    },
    props: {
      selectedGame: {
        type: Object,
        required: true
      },
      finishGameFlag: {
        type: Boolean,
        required: true
      },
      selectedFeature: {
        type: [Object, Boolean],
        required: true
      }, 
      selectedFeatureChange: {
        type: Number,
        required: true
      },
      featuresList: {
        type: [Object, Boolean],
        required: true
      }
    },
    computed: {
      gameTable: function () {
        if (this.selectedGame.gameTable && Array.isArray(this.selectedGame.gameTable.rows) && this.selectedGame.gameTable.rows.length > 0) {
          Vue.nextTick(this.updateHeight)
        }
        return this.selectedGame.gameTable
      }
    },
    watch: {
      'finishGameFlag': function (flag) {
        if (flag) {
          this.finishGame()
        }
      },
      'selectedFeatureChange': function () {
        switch (this.selectedFeature.status) {
          case 'success' :
            this.checkSuccessFeature()
            break
          case 'failed' :
            this.checkFailedFeature()
            break
        }

        this.checkIfLastUnCovered()
      }
    },
    methods: {
      updateHeight () {
        let elSizes = this.$el.getBoundingClientRect()
        this.$el.style.maxHeight = (window.innerHeight - elSizes.top - 30) + 'px'
        this.$el.style.maxWidth = (window.innerWidth - elSizes.left - 40) + 'px'
      },

      finishGame () {
        this.gameTable.showAllCells()
      },

      checkSuccessFeature () {
        this.gameTable.checkSuccessFeature(this.selectedFeature.name, this.selectedFeature.value, this.featuresList.features[this.selectedFeature.name])
      },

      checkFailedFeature () {
        this.gameTable.checkFailedFeature(this.selectedFeature.name, this.selectedFeature.value)
      },

      checkIfLastUnCovered () {
        if (this.gameTable.isOnlyFullMatchUncovered) {
          this.$emit('incrementSuccessGames')
          this.finishGame()
        }
      },

      incrementClicks () {
        this.$emit('incrementClicks')
      },

      incrementSuccessGames () {
        this.$emit('incrementSuccessGames')
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>

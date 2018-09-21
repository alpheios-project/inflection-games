<template>
    <div class="alpheios-inflection-game-table" v-if="gameTable">
        <div class="infl-table infl-table--wide" :style="selectedGame.view.wideView.style">
            <template v-for="row in gameTable.rows">
                <div 
                  :class = "cellClasses(cell)" 
                  v-for = "cell in row.cells"
                  @click = "checkCell(cell)">
                  <template v-if="cell.isDataCell">
                    <span v-show="!cell.gameHidden">{{ cell.value }}</span>
                  </template>
                  <template v-else>
                    <span v-html="cell.value"></span>
                  </template>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'InflectionGameTable',
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
      }
    },
    computed: {
      gameTable: function () {
        console.info('**************gameTable', this.selectedGame.gameTable)
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
      cellClasses: function (cell) {
        let classes = cell.classes
        classes['infl-cell--morph-match'] = false
        classes['infl-data-cell'] = cell.isDataCell
        classes['infl-tbl-cell--data' ] = cell.isDataCell && !cell.gameHidden && !cell.fullMatch
        classes['infl-tbl-cell--full-match'] = cell.isDataCell && !cell.gameHidden && cell.fullMatch
        return classes
      },
      showAllCells: function () {
        this.gameTable.rows.forEach(row => {
          row.cells.forEach(cell => {
            if (cell.isDataCell) { cell.gameHidden = false }
          })
        })
      },

      finishGame: function () {
        this.showAllCells()
      },

      checkCell: function (cell) {
        if (cell.isDataCell && cell.gameHidden && !this.finishGameFlag) {
          this.$emit('incrementClicks')
          cell.gameHidden = false
          if (cell.fullMatch) {
            this.$emit('incrementSuccessGames')
            this.finishGame()
          }
        }
      },

      checkSuccessFeature: function () {
        this.gameTable.rows.forEach(row => {
          row.cells.forEach(cell => {
            if (cell.isDataCell && !cell.fullMatch && cell.features.some(feature => feature.type === this.selectedFeature.name && feature.value !== this.selectedFeature.value)) {
              cell.gameHidden = false
            }
          })
        })
      },

      checkFailedFeature: function () {
        this.gameTable.rows.forEach(row => {
          row.cells.forEach(cell => {
            if (cell.isDataCell && cell.features.some(feature => feature.type === this.selectedFeature.name && feature.value === this.selectedFeature.value)) {
              cell.gameHidden = false
            }
          })
        })
      },

      checkIfLastUnCovered: function () {
        let onlyFullMatchUncovered = this.gameTable.rows.every(row => 
          row.cells.filter(cell => cell.isDataCell && !cell.fullMatch).every(cell => !cell.gameHidden)
        )

        console.info('**********************checkIfLastUnCovered', onlyFullMatchUncovered)

        if (onlyFullMatchUncovered) {
          this.$emit('incrementSuccessGames')
          this.finishGame()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../styles/alpheios";

    .alpheios-inflection-game-table .infl-cell {
        font-size: 14px;
        padding: 2px 5px;
    }

    .alpheios-inflection-game-table .infl-data-cell {
      cursor: pointer;
    }
    
    .alpheios-inflection-game-table div.infl-tbl-cell--data {
      background-color: #fceae6;
      background-image: url(../../images/cross-icon.png);
      background-position: 5% 50%;
      background-size: 12px 12px;
      background-repeat: no-repeat;
      padding: 2px 5px 2px 20px;
      color: #881c07;
    }
    .alpheios-inflection-game-table div.infl-tbl-cell--full-match {
        background-color: #e6fcea;
        background-image: url(../../images/check-icon.png);
        font-weight: 700;
        color: #099f20;
    }

</style>

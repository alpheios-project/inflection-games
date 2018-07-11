<template>
    <div class="alpheios-inflection-game-table" v-if="gameTable">
        <div class="infl-prdgm-tbl">
            <div class="infl-prdgm-tbl__row" v-for="row in gameTable.rows">
                <div 
                  class = "infl-prdgm-tbl__cell" 
                  :class = "cellClasses(cell)" 
                  v-for = "cell in row.cells"
                  @click = "checkCell(cell)">
                    <span v-show="!cell.hidden">{{cell.value}}</span>
                </div>
            </div>
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
        if (this.selectedFeature.status === 'success') {
          this.checkSuccessFeature()
        } 
        if (this.selectedFeature.status === 'failed') {
          this.checkFailedFeature()
        }
        this.checkIfLastUnCovered()
      }
    },
    methods: {
      cellClassesLabel: function (cell) {
        return 'infl-prdgm-tbl-cell--label'
      },
      cellClassesData: function (cell) {
        return {
          'infl-prdgm-tbl-cell--data': !cell.hidden,
          'infl-prdgm-tbl-cell--full-match': !cell.hidden && cell.fullMatch
        }
      },
      cellClasses: function (cell) {
        if (cell.role === 'label') { return this.cellClassesLabel(cell) }
        if (cell.role === 'data') { return this.cellClassesData(cell) }
      },
      showAllCells: function () {
        this.gameTable.rows.forEach(row => {
          row.cells.forEach(cell => {
            if (cell.role === 'data') { cell.hidden = false }
          })
        })
      },

      finishGame: function () {
        this.showAllCells()
      },

      checkCell: function (cell) {
        if (cell.role === 'data' && cell.hidden && !this.finishGameFlag) {
          this.$emit('incrementClicks')
          cell.hidden = false
          if (cell.fullMatch) {
            this.$emit('incrementSuccessGames')
            this.finishGame()
          }
        }
      },

      checkSuccessFeature: function () {
        this.gameTable.rows.forEach(row => {
          row.cells.forEach(cell => {
            if (cell.role === 'data' && cell[this.selectedFeature.name] !== this.selectedFeature.value) { cell.hidden = false }
          })
        })
      },

      checkFailedFeature: function () {
        this.gameTable.rows.forEach(row => {
          row.cells.forEach(cell => {
            if (cell.role === 'data' && cell[this.selectedFeature.name] === this.selectedFeature.value) { cell.hidden = false }
          })
        })
      },

      checkIfLastUnCovered: function () {
        let onlyFullMatchUncovered = this.gameTable.rows.every(row => 
          row.cells.filter(cell => cell.role === 'data' && !cell.fullMatch).every(cell => !cell.hidden)
        )
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

    .infl-prdgm-tbl {
        display: table;
        border-top: 1px solid gray;
        border-left: 1px solid gray;
        margin-bottom: 30px;
    }

    .infl-prdgm-tbl__row {
        display: table-row;
    }

    .infl-prdgm-tbl__cell {
        display: table-cell;
        padding: 2px 5px;
        border-right: 1px solid gray;
        border-bottom: 1px solid gray;
        min-width: 20px;
        cursor: pointer;
    }

    .infl-prdgm-tbl-cell--label {
        font-weight: 700;
        cursor: inherit;
    }

    div.infl-prdgm-tbl-cell--data {
      background-color: #fceae6;
      background-image: url(../../images/cross-icon.png);
      background-position: 5% 50%;
      background-size: auto 50%;
      background-repeat: no-repeat;
      padding: 2px 5px 2px 20px;
      color: #881c07;
    }
    div.infl-prdgm-tbl-cell--full-match {
        background-color: #e6fcea;
        background-image: url(../../images/check-icon.png);
        font-weight: 700;
        color: #099f20;
    }
</style>

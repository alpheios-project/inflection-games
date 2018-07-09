<template>
    <div class="alpheios-games-panel__wide_table" v-if="gameTable">
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
    name: 'InflectionTablePanel',
    data () {
      return {
        gameTable: null
      }
    },
    props: {
      data: {
        type: [Object, Boolean],
        required: true
      },
      inflectionData: {
        type: [Object],
        required: true
      },
      changedGame: {
        type: Number,
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
    watch: {
      'changedGame': function (val) {
        if (this.data && this.data.rows) {
          this.createGameTable()
        }
      },
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
    mounted () {
      if (this.data && this.data.rows) {
        this.createGameTable()
      }
    },
    methods: {
      createGameTable: function () {
        this.gameTable = null
        let table = { rows: [] }

        this.data.rows.forEach(row => {
          let cells = []
          row.cells.forEach(cell => {
            cell.fullMatch = cell.role === 'data' ? this.compareLexemesToCell(cell) : null
            cell.hidden = cell.role === 'data' ? true : false
            cells.push(Object.assign({}, cell))
          })
          table.rows.push({ cells: cells })
        })

        this.gameTable = table
      },
      getFeatures: function (cell) {
        let ignoreProps = ['role', 'value', 'hidden', 'fullMatch']
        return Object.keys(cell).filter(prop => (ignoreProps.indexOf(prop) === -1))
      },
      compareLexemesToCell: function (cell) {
        let cellFeatures = this.getFeatures(cell)

        return this.inflectionData.homonym.lexemes.some(lexeme => 
          lexeme.inflections.some(inflection => 
            cellFeatures.every(feature => {
              return inflection.hasOwnProperty(feature) && inflection[feature].value === cell[feature]
            })
          )
        )
      },
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
        if (cell.role === 'data' && cell.hidden) {
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

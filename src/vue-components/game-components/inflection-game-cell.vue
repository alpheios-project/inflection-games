<template>
    <div 
        :class = "cellClasses(cell)" 
        @click = "checkCell(cell)">
        <span v-if="cell.isDataCell" v-show="!cell.gameHidden">                  

            <template v-for="(morpheme, index) in cell.morphemes" v-if="cell.tableType === 'wideView'">
                <span :class="{ 'infl-suff--full-match': morpheme.match.fullMatch, 'ira-test1': true }">
                    <template v-if="morpheme.value">{{morpheme.value}}</template>
                    <template v-else>-</template>
                </span>
                <template  v-if="index < cell.morphemes.length-1">, </template>
            </template>

            <template v-if="cell.tableType === 'wideTable'">
                <span  :class="{ 'infl-suff--full-match': cell.fullMatch, 'ira-test2': true }">
                {{ cell.value }}
                </span>
            </template>

        </span>
        <span v-else v-html="cell.value"></span>
    </div>
</template>
<script>
export default {
    name: 'InflectionGameCell',
    props: {
      cell: {
        type: Object,
        required: true
      }
    },
    methods: {
      cellClasses: function () {
        let classes = this.cell.classes
        classes['infl-cell--morph-match'] = false
        classes['infl-data-cell'] = this.cell.isDataCell
        classes['infl-tbl-cell--data' ] = this.cell.isDataCell && !this.cell.gameHidden && !this.cell.fullMatch
        classes['infl-tbl-cell--full-match'] = this.cell.isDataCell && !this.cell.gameHidden && this.cell.fullMatch
        return classes
      },
      checkCell: function () {
        if (this.cell.isDataCell && this.cell.gameHidden && !this.finishGameFlag) {
          this.$emit('incrementClicks')
          this.cell.gameHidden = false
          let classes = this.cellClasses(this.cell)
          if (this.cell.fullMatch) {
            this.$emit('incrementSuccessGames')
            this.$emit('finishGame')
          }
        }
      }
    }
}
</script>
<style lang="scss">
    @import "../../styles/alpheios";

    .alpheios-inflection-game-table .infl-cell {
        font-size: 14px;
        padding: 2px 5px;
    }

    .alpheios-inflection-game-table .infl-data-cell {
      cursor: pointer;
      background-position: 5% 50%;
      background-size: 12px 12px;
      background-repeat: no-repeat;
      padding: 2px 5px 2px 20px;
    }
    
    .alpheios-inflection-game-table div.infl-tbl-cell--data {
      background-color: #fceae6;
      background-image: url(../../images/cross-icon.png);
      
      color: #881c07;
    }
    .alpheios-inflection-game-table div.infl-tbl-cell--full-match {
        background-color: #e6fcea;
        background-image: url(../../images/check-icon.png);
        font-weight: 700;
        color: #881c07;
        .infl-suff--full-match {
          color: #fff;
          background-color: #099f20;
          padding: 0 2px;
          font-weight: normal;
        }
    }

</style>
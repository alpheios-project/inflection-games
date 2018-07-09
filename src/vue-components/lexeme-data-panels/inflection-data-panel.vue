<template>
	<div class = "alpheios-inflection-data">
    <p 
      class = "alpheios-inflection-data__no_views"
      v-if = "gamesVariants.length === 0"
      >There are no game variants for selected homonym</p>

    <p 
      class = "alpheios-inflection-data__has_views"
      v-if = "gamesVariants.length > 0"
    >Games variants: 
    <span 
      class = "alpheios-inflection-data__show_hide_variants"
      @click = "changeShowHideVariants"
    >{{ showHideVariantsLabel }}
    </span>
    </p>

		<ul :class = "{ 'alpheios-inflection-data__showOnlySelected': showOnlySelected }">
      <li 
        class="alpheios-inflection-data__game_variant"
        v-for = "(gameVariant, index) in gamesVariants" 
        :key = "index"
        @click = "selectGame(gameVariant)"
        :class="selectedGameVariantClass(gameVariant)"
      >

        <span >
          <b>{{ gameVariant.partOfSpeach }}</b> - {{ gameVariant.view.name }}
        </span>
        
      </li>
    </ul>

	</div>
</template>
<script>
  import { ViewSet, L10n} from 'alpheios-inflection-tables'

  export default {
    name: 'InflectionDataPanel',
    data () {
      return {
        viewSet: null,
        views: [],
        partsOfSpeech: [],
        showOnlySelected: false
      }
    },
    props: {
      inflectionData: {
        type: Object,
        required: true
      },
      locale: {
        type: String,
        required: true
      },
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
      /* filter parts of speach (from viewSet) that has new vue Component tables */
      filteredPartsOfSpeach: function () {
        return this.partsOfSpeech.filter(partOfSpeach => this.viewSet.getViews(partOfSpeach).filter(view => view.hasComponentData).length > 0)
      },
      /* create game variants with parts of speacn and views that has new vue Component tables */
      gamesVariants: function () {
        let variants = []
        this.filteredPartsOfSpeach.forEach(partOfSpeach => 
          this.getViewsByPartOfSpeach(partOfSpeach).forEach(view => 
            variants.push({ partOfSpeach: partOfSpeach, view: view })
          )
        )
        return variants
      },
      /* label for show/hide label */
      showHideVariantsLabel: function () {
        return this.showOnlySelected ? 'show all' : 'hide unselected'
      }
    },
    methods: {
      /* return an array only with features from the cell */
      getFeatures: function (cell) {
        return Object.keys(cell).filter(prop => (prop !== 'role' && prop !== 'value'))
      },
      /* return true if even one inflection has fullMatch with the cell */
      compareLexemesToCell: function (cell) {
        let cellFeatures = this.getFeatures(cell)

        return this.inflectionData.homonym.lexemes.some(lexeme => 
          lexeme.inflections.some(inflection => 
            cellFeatures.every(feature => inflection.hasOwnProperty(feature) && inflection[feature].value === cell[feature])
          )
        )
      },
      /* return true if even on cell has fullMatch */
      findFullMatchInView: function (view) {
        return view.wideTable.rows.some(row =>
          row.cells.some(cell => (cell.role === 'data') && this.compareLexemesToCell(cell))
        )
      },
      /* filter array of views that has full match */
      filterViewsWithFullMatch: function (viewsArray) {
        return viewsArray.filter(view => this.findFullMatchInView(view))
      },
      /* returns only those vies from viewsArray that has even one fullMatch */
      getViewsByPartOfSpeach: function (partOfSpeach) {
        return this.filterViewsWithFullMatch(this.viewSet.getViews(partOfSpeach))
      },
      initViewSet: function () {
        this.viewSet = new ViewSet(this.inflectionData, this.locale)
        this.partsOfSpeech = this.viewSet.partsOfSpeech 
      },
      selectGame: function (gameVariant) {
        this.$emit('selectedGame', gameVariant)
      },
      selectedGameVariantClass: function (gameVariant) {
        return { "alpheios-inflection-data__game_variant_selected": (this.selectedGameVariantReady && gameVariant && this.selectedGameVariant.view.id === gameVariant.view.id) }
      },
      changeShowHideVariants: function () {
        if (this.selectedGameVariantReady) {
          this.showOnlySelected = !this.showOnlySelected
        }
      }
    },
    mounted () {
      this.initViewSet()
    },
    watch: {
      inflectionData () {
        this.initViewSet()
      }
    }
  }
</script>
<style  lang="scss">
  .alpheios-inflection-data__no_views,
  .alpheios-inflection-data__has_views {
    margin: 10px 0;
  }

  .alpheios-inflection-data__show_hide_variants {
    cursor: pointer;
    color: #3E8D9C;
  }

  .alpheios-inflection-data__game_variant {
    cursor: pointer;
  }

  .alpheios-inflection-data__showOnlySelected .alpheios-inflection-data__game_variant {
    display: none;
  }

  .alpheios-inflection-data__game_variant_selected {
    color: #E49A0D;
    display: block;
  }

  .alpheios-inflection-data__showOnlySelected .alpheios-inflection-data__game_variant_selected {
     display: block;
  }

</style>
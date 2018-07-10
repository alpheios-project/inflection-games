<template>
	<div class = "alpheios-inflection-views-games">

    <p class="alpheios-inflection-views-games__title">
      {{ inflectionViewsGamesTitle }}
      <span 
        class = "alpheios-inflection-views-games__show_hide_link"
        @click = "showHideVariants"
      >{{ showHideVariantsLabel }}
      </span>
    </p>

		<ul 
      class = "alpheios-inflection-views-games__list"
    >
      <li 
        class="alpheios-inflection-views-games__list__item"
        :class="{ 'alpheios-inflection-views-games__list__item__selected': selectedId === gameVariant.view_id }"

        v-for = "(gameVariant, index) in gamesList" 
        :key = "index"
        @click = "selectGame(gameVariant)"

        v-show = "!showOnlySelected || selectedId === gameVariant.view_id"
      >

        <span >
          <b>{{ gameVariant.partOfSpeech }}</b> - {{ gameVariant.view_name }}
          
        </span>
        
      </li>
    </ul>

	</div>
</template>
<script>
  import { ViewSet } from 'alpheios-inflection-tables'

  export default {
    name: 'InflectionViewsGames',
    data () {
      return {
        viewSet: null,
        views: [],
        partsOfSpeech: [],

        showOnlySelected: false,
        selectedId: null
      }
    },
    props: {
      gamesList: {
        type: Array,
        required: true
      },
      locale: {
        type: String,
        required: true
      },
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
      inflectionViewsGamesTitle: function () {
        return this.gamesList && this.gamesList.length > 0 ? 'Games variants' : 'There are no game variants for selected homonym'
      },
      showHideVariantsLabel: function () {
        return this.showOnlySelected ? 'show all' : 'hide unselected'
      }
    },
    methods: {
      selectGame: function (gameVariant) {
        this.selectedId = gameVariant.view_id
        this.$emit('selectedGameEvent', gameVariant)
      },
      showHideVariants: function () {
        if (this.selectedGameReady) {
          this.showOnlySelected = !this.showOnlySelected
        }
      }
    }
  }
</script>
<style  lang="scss" scoped>
  @import "../../styles/alpheios";

  .alpheios-inflection-views-games {
    border: 1px solid $alpheios-sidebar-header-border-color;
    padding: 0 5px 5px;
    margin: 20px 0;
  }

  .alpheios-inflection-views-games__title {
    display: inline-block;
    background: #fff;
    position: relative;
    top: -10px;
    margin: 0;
  }

  .alpheios-inflection-views-games__hidden {
    border: 0;
    padding: 0;
    margin: 20px 0 0;
  }

  .alpheios-inflection-views-games__show_hide_link {
    font-weight: bold;
    color: $alpheios-link-color;
    display: inline-block;
    padding: 0 5px;
    cursor: pointer;
  }

  .alpheios-inflection-views-games__list {
    margin: 0;
  }

  .alpheios-inflection-views-games__list__item {
    cursor: pointer;
  }

  .alpheios-inflection-views-games__list__item__selected {
    color: $alpheios-highlight-dark-color;
  }

</style>
<template>
	<div class = "alpheios-inflection-views-games" :class = "{ 'alpheios-inflection-views-games__hidden': showOnlySelected }">

    <p class="alpheios-inflection-views-games__title">
      {{ inflectionViewsGamesTitle }}
      <span 
        class = "alpheios-inflection-views-games__show_hide_link"
        @click = "showHideVariants"
      >{{ showHideVariantsLabel }}
      </span>
      <span class = "alpheios-inflection-views-games__selected_label" v-if="selectedGame">
        {{ selectedGame.type }}: {{ selectedGame.partOfSpeech }} - {{ selectedGame.name }}
      </span>
    </p>

		<ul 
      class = "alpheios-inflection-views-games__list"
      v-show = "!showOnlySelected"
    >
      <li 
        v-for="(gameKey, indexGT) in gamesListKeys" 
        :key="indexGT"
      >
        <p 
          class = "alpheios-inflection-views-games__game_title"
          v-show = "!showOnlySelected || checkHasSelectedChildren(gameKey)"
        >{{ gameKey }}</p>
        <ul>
          <li 
            v-for="(gameItem, indexItem) in gamesList[gameKey]"
            :key="indexItem"

            class="alpheios-inflection-views-games__list__item"
            :class="{ 'alpheios-inflection-views-games__list__item__selected': selectedId === gameItem.id }"

            @click = "selectGame(gameItem)"
            v-show = "!showOnlySelected"
          >
            <span >
              <b>{{ gameItem.partOfSpeech }}</b> - {{ gameItem.name }}
            </span>

          </li>
        </ul>
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
        type: Object,
        required: true
      },
      gamesListChanged: {
        type: Number,
        required: true
      },
      selectedGameReady: {
        type: Boolean,
        required: true
      },
      selectedGame: {
        type: [Object, Boolean],
        required: true
      }
    },
    watch: {
      gamesListChanged () {
        this.clearSelectedStatus()
      },
      selectedGameReady (flag) {
        if (!flag) { this.clearSelectedStatus() }
      }
    },
    computed: {
      gamesListKeys () {
        return Object.keys(this.gamesList)
      },

      inflectionViewsGamesTitle () {
        return this.gamesList && Object.values(this.gamesList).length > 0 ? 'Games variants' : 'There are no game variants for selected homonym'
      },

      showHideVariantsLabel () {
        return this.showOnlySelected ? 'show' : 'hide'
      }
    },
    methods: {
      selectGame (gameVariant) {
        this.selectedId = gameVariant.id
        this.$emit('selectedGameEvent', gameVariant.id, gameVariant.type)
        this.showOnlySelected = true
      },
      showHideVariants () {
        if (this.selectedGameReady) {
          this.showOnlySelected = !this.showOnlySelected
        }
      },
      checkHasSelectedChildren (gameKey) {
        return this.gamesList[gameKey] ? Object.values(this.gamesList[gameKey]).some(game => game.id === this.selectedId) : false
      },

      clearSelectedStatus () {
        this.selectedId = null
        this.showOnlySelected = false
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

  .alpheios-inflection-views-games__hidden {
    border: 0;
    padding: 0;
    margin: 5px 0 10px;
    font-size: 90%;
  }

  .alpheios-inflection-views-games__title {
    display: inline-block;
    background: #fff;
    position: relative;
    top: -10px;
    margin: 0;
  }

  .alpheios-inflection-views-games__show_hide_link {
    font-weight: bold;
    color: $alpheios-link-color;
    display: inline-block;
    padding: 0 5px;
    cursor: pointer;
  }

  .alpheios-inflection-views-games__selected_label {
    font-weight: bold;
    display: inline-block;
    padding: 0 5px;
    font-weight: bold;
  }

  .alpheios-inflection-views-games__list {
    margin: 0;
    list-style: none;
    padding: 0;
  }

  .alpheios-inflection-views-games__game_title {
    font-weight: bold;
    margin: 0 0 5px 0;
  }

  .alpheios-inflection-views-games__list__item {
    cursor: pointer;
    margin-bottom: 5px;
  }

  .alpheios-inflection-views-games__list__item__selected {
    color: $alpheios-highlight-dark-color;
  }

</style>
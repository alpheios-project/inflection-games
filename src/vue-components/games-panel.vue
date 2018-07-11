<template>
	<div 
		id = "alpheios-games-panel"
		class = "auk"
		v-show = "visible" 
		:style = "mainstyles">

        <icon-button 
        	@iconClickEvent = 'closePanel'
        	tooltipText = "Close"
        	tooltipDirection = "left"
        	:additionalStyles = "stylesForTooltipCloseIcon"
        ><close-icon></close-icon></icon-button>

		<title-block
			v-if = "homonym.targetWord"
			:word = "homonym.targetWord"
		></title-block>
		<lexemes-data-block 
			v-if = "showFeaturesPanel"
			:lexemes = "homonym.lexemes" 
			:definitionsDataReady = "data.definitionsDataReady"
			:definitions = "definitionsFinal"
		></lexemes-data-block>

		<inflection-views-games 
			v-if = "showInflectionsPanel"
			:gamesList = "gamesSet.gamesList"
      :gamesListChanged = "gamesListChanged"
      
			:locale = "data.locale"
			@selectedGameEvent = "selectedGameEvent"

			:selectedGameReady = "selectedGameReady"
			:selectedGame = "selectedGame"
		></inflection-views-games>

		<selected-game-block
			:selectedGameReady = "selectedGameReady"
			:selectedGame = "selectedGame"
			:changedGame = "changedGame"
		></selected-game-block>
	</div>
</template>
<script>
  import CloseIcon from '@/images/inline-icons/close.svg'
  import IconButton from '@/vue-components/common-components/icon-button.vue'

  import interact from 'interactjs'
  
  import TitleBlock from '@/vue-components/header-components/title-block.vue'
  import LexemesDataBlock from '@/vue-components/header-components/lexemes-data-block.vue'
  import InflectionViewsGames from '@/vue-components/header-components/inflection-views-games.vue'
  import SelectedGameBlock from '@/vue-components/selected-game-block.vue'

  import WindowServices from '@/lib/window-services.js'
  import GamesSet from '@/lib/games-set.js'

  export default {
    name: 'GamePanel',
    components: {
      closeIcon: CloseIcon,
      iconButton: IconButton,

      titleBlock: TitleBlock,
      lexemesDataBlock: LexemesDataBlock,
      InflectionViewsGames: InflectionViewsGames,

      selectedGameBlock: SelectedGameBlock
    },
    data () {
      return {
        draggable: true,
        interactInstance: undefined,
        selectedGame: false,
        selectedGameReady: false,
        changedGame: 0,
        gamesListChanged: 0
      }
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      visible: {
        type: Boolean,
        required: true
      },
      homonym: {
        type: [Object, Boolean],
        required: true
      }
    },
    computed: {
      mainstyles: function () {
      	return {
      	  'z-index': this.data.zIndex
      	}
      },
      stylesForTooltipCloseIcon: function () {
      	return {
      	  'position': 'absolute',
      	  'right': '5px',
      	  'width': '30px'
      	}
      },
      gamesSet: function () {
        this.gamesListChanged = this.gamesListChanged + 1
      	return this.data.inflectionDataReady && this.data.locale ? new GamesSet(this.data.inflectionData, this.data.locale) : {}
      },
      inflectionDataFinal: function () {
      	return this.data.inflectionDataReady ? this.data.inflectionData : {}
      },
      definitionsFinal: function () {
      	return this.data.definitionsDataReady ? this.data.definitions : {}
      },
      showFeaturesPanel: function () {
      	return this.homonym.lexemes && this.homonym.lexemes.length > 0
      },
      showInflectionsPanel: function () {
      	return this.data.inflectionDataReady && this.data.locale
      }
    },
    methods: {
      closePanel () {
      	this.clearData()
        this.$emit('close')
      },
      selectedGameEvent (gameVariant) {
      	this.selectedGame = gameVariant
      	this.selectedGameReady = true
      	this.changedGame = this.changedGame + 1
      },
      clearData () {
        this.selectedGame = false
        this.selectedGameReady = false
        this.changedGame = 0
        this.gamesListChanged = 0
      }
    },
    mounted () {
      if (this.data && this.data.draggable) {
        this.interactInstance = interact(this.$el)
          .draggable(WindowServices.draggableSettings())
      }
    }
  }	
</script>
<style lang="scss">
	@import "../styles/alpheios";

	#alpheios-games-panel {
		font-family: $alpheios-font-family;
    	font-size: $alpheios-base-font-size;
    	line-height: normal;

		min-width: 200px;
		max-width: 90%;
		min-height: 200px;
		color: $alpheios-games-panel-text-color;
		background: $alpheios-games-panel-background;
		position: fixed;
		left: 50px;
		top: 50px;

		border: 1px solid $alpheios-games-panel-border-color;
		padding: 10px;

		-webkit-box-shadow: 4px 4px 10px 1px $alpheios-games-panel-border-shadow-color;
		-moz-box-shadow: 4px 4px 10px 1px $alpheios-games-panel-border-shadow-color;
		box-shadow: 4px 4px 10px 1px $alpheios-games-panel-border-shadow-color;
	}
    .alpheios-games-panel__close-btn {
        display: block;
        position: absolute;
        width: 20px;
        right: 5px;
        top: 2px;
        cursor: pointer;
        fill: $alpheios-link-color-dark-bg;
        stroke: $alpheios-link-color-dark-bg;
    }

    .alpheios-games-panel__close-btn:hover,
    .alpheios-games-panel__close-btn:focus {
        fill: $alpheios-link-hover-color;
        stroke: $alpheios-link-hover-color;
    }
</style>